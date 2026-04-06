import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

export type SectionType =
	| "concept"
	| "definition"
	| "formula"
	| "example"
	| "keypoint"
	| "summary";

export type StudyNoteSection = {
	heading: string;
	type: SectionType;
	content: string;
};

export type StudyNote = {
	title: string;
	sections: StudyNoteSection[];
};

export type DbNote = StudyNote & {
	id: string;
	user_id: string;
	created_at: string;
	updated_at?: string;
};

export type PreviewState = {
	url: string;
	file: File;
};

export function useStudyNotes() {
	const [notes, setNotes] = useState<StudyNote[]>([]);
	const [activeNote, setActiveNote] = useState<number>(-1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<PreviewState | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState<boolean>(true);
	const [dbNotes, setDbNotes] = useState<DbNote[]>([]);
	const [dbNotesLoading, setDbNotesLoading] = useState<boolean>(false);
	const [activeDbNoteId, setActiveDbNoteId] = useState<string | null>(null);
	const [editingNote, setEditingNote] = useState<DbNote | null>(null);
	const [supabase] = useState(() => createClient());
	const lastLoadedTokenRef = useRef<string | null>(null);

	const loadNotes = useCallback(
		async (accessToken?: string) => {
			setDbNotesLoading(true);
			try {
				const token =
					accessToken ?? (await supabase.auth.getSession()).data.session?.access_token;

				if (!token) {
					setDbNotes([]);
					return;
				}

				const response = await fetch("/api/notes", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					const errorData = await response.json();

					if (response.status === 401) {
						await supabase.auth.signOut();
						setUser(null);
					}

					console.error("Failed to fetch notes:", errorData.error);
					setDbNotes([]);
					return;
				}

				const { notes } = await response.json();
				setDbNotes(notes ?? []);
			} catch (err) {
				console.error("Failed to load saved notes:", err);
				setDbNotes([]);
			} finally {
				setDbNotesLoading(false);
			}
		},
		[supabase],
	);

	const syncSessionState = useCallback(
		async (session: Session | null, forceReload = false) => {
			const signedInUser = session?.user ?? null;
			setUser(signedInUser);

			if (!signedInUser) {
				lastLoadedTokenRef.current = null;
				setActiveDbNoteId(null);
				setDbNotes([]);
				setDbNotesLoading(false);
				return;
			}

			const accessToken = session?.access_token ?? null;

			if (!forceReload && lastLoadedTokenRef.current === accessToken) {
				setDbNotesLoading(false);
				return;
			}

			lastLoadedTokenRef.current = accessToken;
			await loadNotes(accessToken ?? undefined);
		},
		[loadNotes],
	);

	useEffect(() => {
		let isActive = true;

		const initializeSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!session) {
					if (!isActive) return;
					await syncSessionState(null);
					return;
				}

				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();

				if (error || !user) {
					await supabase.auth.signOut();
					if (!isActive) return;
					await syncSessionState(null);
					return;
				}

				if (!isActive) return;
				await syncSessionState(session, true);
			} finally {
				if (isActive) {
					setAuthLoading(false);
				}
			}
		};

		void initializeSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "INITIAL_SESSION") {
				return;
			}

			void syncSessionState(session).finally(() => {
				if (isActive) {
					setAuthLoading(false);
				}
			});
		});

		return () => {
			isActive = false;
			subscription.unsubscribe();
		};
	}, [supabase, syncSessionState]);

	const saveNote = async (note: StudyNote) => {
		if (!user) return null;

		const { data, error } = await supabase
			.from("notes")
			.insert({
				user_id: user.id,
				title: note.title,
				sections: note.sections,
			})
			.select()
			.single<DbNote>();

		if (error) {
			console.error(error);
			return null;
		}

		await loadNotes();
		return data;
	};

	const updateNote = async (id: string, note: StudyNote) => {
		const { data, error } = await supabase
			.from("notes")
			.update({
				title: note.title,
				sections: note.sections,
			})
			.eq("id", id)
			.select()
			.single<DbNote>();

		if (error) {
			console.error(error);
			return null;
		}

		await loadNotes();
		return data;
	};

	const deleteNote = async (id: string) => {
		const { error } = await supabase.from("notes").delete().eq("id", id);
		if (error) console.error(error);
		else loadNotes();
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		setNotes([]);
		setActiveNote(-1);
		setActiveDbNoteId(null);
		setDbNotes([]);
	};

	const processImage = async (file: File) => {
		setError(null);
		setLoading(true);

		try {
			const base64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					const data = reader.result as string;
					resolve(data.split(",")[1]);
				};
				reader.onerror = () => reject(new Error("Failed to read file"));
				reader.readAsDataURL(file);
			});

			const mediaType = file.type || "image/png";

			const response = await fetch("/api/process-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ base64, mediaType }),
			});

			if (!response.ok) {
				throw new Error(
					`Server Error: ${response.status} ${response.statusText}`,
				);
			}

			const parsed = (await response.json()) as StudyNote;

			const newNotes = [...notes, parsed];
			setNotes(newNotes);
			setActiveNote(newNotes.length - 1);
			setPreview(null);

			if (user) {
				const savedNote = await saveNote(parsed);
				if (savedNote) {
					setActiveDbNoteId(savedNote.id);
				}
			}
		} catch (err) {
			console.error(err);
			setError(
				"Failed to process the image. Please try again with a clear screenshot.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = (file: File) => {
		setPreview({ url: URL.createObjectURL(file), file });
	};

	return {
		notes,
		activeNote,
		loading,
		error,
		setError,
		preview,
		isDragging,
		user,
		authLoading,
		dbNotes,
		dbNotesLoading,
		activeDbNoteId,
		editingNote,
		setNotes,
		setActiveNote,
		setActiveDbNoteId,
		setPreview,
		setIsDragging,
		setEditingNote,
		loadNotes,
		saveNote,
		updateNote,
		deleteNote,
		signOut,
		processImage,
		handleImageUpload,
	};
}
