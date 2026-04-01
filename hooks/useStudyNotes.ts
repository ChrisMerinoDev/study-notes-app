import { useState, useEffect, useCallback } from "react";
import { createClient } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

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
	const [dbNotes, setDbNotes] = useState<DbNote[]>([]);
	const [editingNote, setEditingNote] = useState<DbNote | null>(null);

	const supabase = createClient();

	const loadNotes = useCallback(async () => {
		const { data, error } = await supabase
			.from("notes")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) console.error(error);
		else setDbNotes(data ?? []);
	}, [supabase]);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser(user);
				await loadNotes();
			}
		};

		checkUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			const signedInUser = session?.user ?? null;
			setUser(signedInUser);
			if (signedInUser) {
				loadNotes();
			}
		});

		return () => subscription.unsubscribe();
	}, [loadNotes, supabase.auth]);

	const saveNote = async (note: StudyNote) => {
		if (!user) return;

		const { error } = await supabase.from("notes").insert({
			user_id: user.id,
			title: note.title,
			sections: note.sections,
		});

		if (error) console.error(error);
		else loadNotes();
	};

	const updateNote = async (id: string, note: StudyNote) => {
		const { error } = await supabase
			.from("notes")
			.update({
				title: note.title,
				sections: note.sections,
			})
			.eq("id", id);

		if (error) console.error(error);
		else loadNotes();
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
				await saveNote(parsed);
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
		dbNotes,
		editingNote,
		setNotes,
		setActiveNote,
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
