"use client";

import { useState } from "react";
import { useStudyNotes } from "../hooks/useStudyNotes";
import type {
	DbNote,
	StudyNote,
	StudyNoteSection,
} from "../hooks/useStudyNotes";
import Auth from "../components/Auth";
import EditNote from "../components/EditNote";
import PaperTexture from "../components/ui/PaperTexture";
import NoteCard from "../components/ui/NoteCard";
import UploadZone from "../components/ui/UploadZone";
import LoadingState from "../components/ui/LoadingState";
import PreviewThumbnail from "../components/ui/PreviewThumbnail";
import SavedNotes from "../components/ui/SavedNotes";

export const dynamic = "force-dynamic";

export default function StudyNotesApp() {
	const {
		notes,
		activeNote,
		loading,
		error,
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
		setError,
		updateNote,
		deleteNote,
		signOut,
		processImage,
		handleImageUpload,
	} = useStudyNotes();
	const [sectionError, setSectionError] = useState<string | null>(null);
	const [isSyncingSections, setIsSyncingSections] = useState(false);
	const [pendingDeleteNote, setPendingDeleteNote] = useState<DbNote | null>(
		null,
	);

	const currentNote = activeNote >= 0 ? notes[activeNote] : null;
	const noteCountLabel = `${dbNotes.length} saved note${dbNotes.length === 1 ? "" : "s"}`;

	const persistActiveNote = async (nextNote: StudyNote) => {
		if (!activeDbNoteId) {
			throw new Error("No saved note selected.");
		}

		const updatedNote = await updateNote(activeDbNoteId, nextNote);

		if (!updatedNote) {
			throw new Error("Failed to save note changes.");
		}

		setSectionError(null);
	};

	const replaceActiveNote = (nextNote: StudyNote) => {
		setNotes((prevNotes) =>
			prevNotes.map((note, noteIndex) =>
				noteIndex === activeNote ? nextNote : note,
			),
		);
	};

	const updateCurrentNoteSections = (
		nextSections: StudyNoteSection[],
		previousSections: StudyNoteSection[],
	) => {
		if (!currentNote || activeNote < 0) return;

		const nextNote = {
			...currentNote,
			sections: nextSections,
		};

		const previousNote = {
			...currentNote,
			sections: previousSections,
		};

		replaceActiveNote(nextNote);
		setSectionError(null);
		setIsSyncingSections(true);

		void persistActiveNote(nextNote)
			.catch((err) => {
				console.error(err);
				replaceActiveNote(previousNote);
				setSectionError(
					"Could not save your section changes. Changes were reverted.",
				);
			})
			.finally(() => {
				setIsSyncingSections(false);
			});
	};

	const handleSectionSave = (
		sectionIndex: number,
		nextSection: StudyNoteSection,
	) => {
		if (!currentNote) return;

		const previousSections = currentNote.sections;
		const nextSections = currentNote.sections.map((section, index) =>
			index === sectionIndex ? nextSection : section,
		);

		updateCurrentNoteSections(nextSections, previousSections);
	};

	const handleSectionDelete = (sectionIndex: number) => {
		if (!currentNote) return;

		const previousSections = currentNote.sections;
		const nextSections = currentNote.sections.filter(
			(_, index) => index !== sectionIndex,
		);

		updateCurrentNoteSections(nextSections, previousSections);
	};

	const confirmDeleteNote = async () => {
		if (!pendingDeleteNote) return;

		const deletingActiveNote = pendingDeleteNote.id === activeDbNoteId;
		await deleteNote(pendingDeleteNote.id);

		if (deletingActiveNote) {
			setNotes([]);
			setActiveNote(-1);
			setActiveDbNoteId(null);
			setPreview(null);
			setSectionError(null);
		}

		setPendingDeleteNote(null);
	};

	if (authLoading) {
		return (
			<div className="auth-overlay">
				<div className="auth-modal auth-modal-loading">
					<p className="auth-kicker">Session</p>
					<h2 className="auth-title">Restoring session</h2>
					<p className="auth-copy">
						Validating your saved login and loading your notes.
					</p>
				</div>
			</div>
		);
	}

	if (!user) return <Auth onAuth={() => {}} />;

	if (editingNote) {
		return (
			<EditNote
				note={editingNote}
				onSave={(updated) => {
					updateNote(editingNote.id, updated);
					setEditingNote(null);
				}}
				onCancel={() => setEditingNote(null)}
			/>
		);
	}

	return (
		<div className="app-layout">
			<PaperTexture />

			<div className="app-shell">
				<aside className="app-sidebar">
					<div className="sidebar-brand">
						<div className="sidebar-brand-mark">SN</div>
						<div>
							<p className="sidebar-eyebrow">Study workspace</p>
							<h1 className="sidebar-title">StudyNotes</h1>
							<p className="sidebar-subtitle">AI-structured lecture capture</p>
						</div>
					</div>

					<div className="sidebar-panel sidebar-panel-emphasis">
						<p className="sidebar-panel-label">Quick start</p>
						<h2 className="sidebar-panel-title">
							Capture a clean screenshot, then let the app organize the material
							into sections.
						</h2>
						<p className="sidebar-panel-copy">
							Works best with lecture slides, textbook pages, whiteboards, and
							handwritten notes.
						</p>
						<button
							onClick={() => {
								setActiveNote(-1);
								setActiveDbNoteId(null);
								setPreview(null);
								setError(null);
							}}
							className="button button-primary sidebar-cta"
						>
							Create New Note
						</button>
					</div>

					<div className="sidebar-section">
						<div className="sidebar-section-header">
							<div>
								<p className="sidebar-section-label">Library</p>
								<p className="sidebar-section-meta">{noteCountLabel}</p>
							</div>
							<button
								onClick={signOut}
								className="button button-danger button-compact"
								type="button"
							>
								Sign Out
							</button>
						</div>

						{dbNotesLoading ? (
							<div className="sidebar-empty-state">
								<p>Loading your notes...</p>
							</div>
						) : (
							<SavedNotes
								notes={dbNotes}
								activeId={activeDbNoteId}
								onSelect={(i) => {
									setNotes([dbNotes[i]]);
									setActiveNote(0);
									setActiveDbNoteId(dbNotes[i].id);
								}}
								onEdit={(i) => setEditingNote(dbNotes[i])}
								onDelete={(note) => setPendingDeleteNote(note)}
							/>
						)}
					</div>

					<div className="sidebar-panel sidebar-panel-muted">
						<p className="sidebar-panel-label">Capture tips</p>
						<ul className="sidebar-tips">
							<li>
								Use well-lit screenshots with the content filling the frame.
							</li>
							<li>
								Crop distractions before uploading for cleaner extraction.
							</li>
							<li>Dense pages work best when text is sharp and horizontal.</li>
						</ul>
					</div>
				</aside>

				<main className="app-main">
					{!currentNote && !loading && (
						<section className="hero-layout">
							<div className="hero-copy">
								<p className="hero-kicker">Screenshot to study set</p>
								<h2 className="hero-title">
									Turn class material into <span>editorial-quality notes</span>
								</h2>
								<p className="hero-description">
									Upload a slide, textbook page, or whiteboard photo and get
									structured notes you can scan, edit, and keep synced.
								</p>
							</div>

							<div className="hero-stats" aria-label="App benefits">
								<div className="hero-stat-card">
									<span className="hero-stat-value">2-8</span>
									<span className="hero-stat-label">
										smart sections per note
									</span>
								</div>
								<div className="hero-stat-card">
									<span className="hero-stat-value">Live</span>
									<span className="hero-stat-label">
										editing after generation
									</span>
								</div>
								<div className="hero-stat-card">
									<span className="hero-stat-value">Cloud</span>
									<span className="hero-stat-label">saved note library</span>
								</div>
							</div>

							{preview ? (
								<div className="preview-panel">
									<div className="preview-panel-header">
										<div>
											<p className="preview-panel-label">Ready to process</p>
											<h3 className="preview-panel-title">
												Review the uploaded capture
											</h3>
										</div>
										<button
											onClick={() => processImage(preview.file)}
											className="button button-primary button-large"
										>
											Generate Notes
										</button>
									</div>
									<PreviewThumbnail
										src={preview.url}
										onRemove={() => setPreview(null)}
									/>
								</div>
							) : (
								<UploadZone
									onImageUpload={handleImageUpload}
									isDragging={isDragging}
									setIsDragging={setIsDragging}
								/>
							)}

							{error && (
								<div className="message-banner message-banner-error">
									<p>{error}</p>
								</div>
							)}
						</section>
					)}

					{loading && <LoadingState />}

					{currentNote && !loading && (
						<section className="note-workspace">
							<div className="note-header-card">
								<div>
									<p className="note-header-kicker">Lecture notes</p>
									<h2 className="note-header-title">{currentNote.title}</h2>
								</div>
								<div className="note-header-meta">
									<span>{currentNote.sections.length} sections</span>
									<span>{activeDbNoteId ? "Synced" : "Unsaved"}</span>
								</div>
							</div>

							{sectionError && (
								<div className="message-banner message-banner-error">
									<p>{sectionError}</p>
								</div>
							)}

							{isSyncingSections && (
								<div className="message-banner message-banner-neutral">
									<p>Saving your section changes...</p>
								</div>
							)}

							<div className="note-grid">
								{currentNote.sections.map((section, index) => (
									<NoteCard
										key={`${section.heading}-${index}`}
										section={section}
										index={index}
										onSave={(updatedSection) =>
											handleSectionSave(index, updatedSection)
										}
										onDelete={() => handleSectionDelete(index)}
									/>
								))}
							</div>
						</section>
					)}
				</main>
			</div>

			{pendingDeleteNote && (
				<div className="confirm-modal-overlay">
					<div className="confirm-modal">
						<p className="confirm-modal-eyebrow">Delete note</p>
						<h3 className="confirm-modal-title">Remove this saved note?</h3>
						<p className="confirm-modal-text">
							This deletes <strong>{pendingDeleteNote.title}</strong> from your
							library.
						</p>
						<div className="confirm-modal-actions">
							<button
								type="button"
								onClick={() => setPendingDeleteNote(null)}
								className="confirm-modal-cancel"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => void confirmDeleteNote()}
								className="confirm-modal-delete"
							>
								Delete Note
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
