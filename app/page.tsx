"use client";

import { FONTS_LINK } from "../utils/constants";
import { useStudyNotes } from "../hooks/useStudyNotes";
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
		dbNotes,
		editingNote,
		setNotes,
		setActiveNote,
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

	const currentNote = activeNote >= 0 ? notes[activeNote] : null;

	if (!user) return <Auth onAuth={() => {}} />;

	if (editingNote)
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

	return (
		<div
			style={{
				minHeight: "100vh",
				position: "relative",
				fontFamily: "'DM Sans', sans-serif",
			}}
		>
			<link href={FONTS_LINK} rel="stylesheet" />
			<PaperTexture />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					minHeight: "100vh",
				}}
			>
				{/* Sidebar */}
				<div
					style={{
						width: "260px",
						flexShrink: 0,
						borderRight: "1px solid #E5E7EB",
						background: "rgba(255,255,255,0.5)",
						backdropFilter: "blur(12px)",
						padding: "32px 20px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{/* Logo */}
					<div style={{ marginBottom: "40px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "10px",
								marginBottom: "4px",
							}}
						>
							<span style={{ fontSize: "24px" }}>📓</span>
							<h1
								style={{
									fontFamily: "'Newsreader', serif",
									fontSize: "24px",
									fontWeight: 500,
									color: "#1a1a2e",
									margin: 0,
									letterSpacing: "-0.02em",
								}}
							>
								StudyNotes
							</h1>
						</div>
						<p
							style={{
								fontSize: "12px",
								color: "#9CA3AF",
								margin: "4px 0 0 34px",
								fontWeight: 400,
							}}
						>
							AI-powered lecture notes
						</p>
					</div>

					{/* New Note button */}
					<button
						onClick={() => {
							setActiveNote(-1);
							setPreview(null);
							setError(null);
						}}
						style={{
							background: "#1a1a2e",
							color: "#fff",
							border: "none",
							borderRadius: "12px",
							padding: "12px 20px",
							cursor: "pointer",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "14px",
							fontWeight: 600,
							marginBottom: "28px",
							transition: "all 0.2s ease",
							letterSpacing: "0.01em",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = "#2d2b55")}
						onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a2e")}
					>
						+ New Note
					</button>

					<SavedNotes
						notes={dbNotes}
						activeIdx={activeNote}
						onSelect={(i) => {
							setNotes([dbNotes[i]]);
							setActiveNote(0);
						}}
						onEdit={(i) => setEditingNote(dbNotes[i])}
						onDelete={(id) => deleteNote(id)}
					/>

					<button
						onClick={signOut}
						style={{
							background: "#DC2626",
							color: "#fff",
							border: "none",
							borderRadius: "8px",
							padding: "8px 16px",
							cursor: "pointer",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "12px",
							fontWeight: 600,
							marginBottom: "16px",
						}}
					>
						Sign Out
					</button>

					{/* Tips */}
					<div
						style={{
							marginTop: "auto",
							padding: "16px",
							background: "#F9FAFB",
							borderRadius: "12px",
						}}
					>
						<p
							style={{
								fontSize: "12px",
								color: "#6B7280",
								margin: 0,
								lineHeight: 1.6,
							}}
						>
							<strong style={{ color: "#4B5563" }}>Tips:</strong>
							<br />
							• Use clear, well-lit screenshots
							<br />
							• Crop to just the content area
							<br />• Works with slides, textbooks & handwritten notes
						</p>
					</div>
				</div>

				{/* Main area */}
				<div
					style={{
						flex: 1,
						padding: "40px 48px",
						maxWidth: "860px",
						margin: "0 auto",
						overflowY: "auto",
					}}
				>
					{!currentNote && !loading && (
						<>
							{/* Header */}
							<div style={{ marginBottom: "40px", textAlign: "center" }}>
								<h2
									style={{
										fontFamily: "'Newsreader', serif",
										fontSize: "36px",
										fontWeight: 400,
										color: "#1a1a2e",
										margin: "0 0 10px 0",
										letterSpacing: "-0.02em",
									}}
								>
									Turn screenshots into
									<br />
									<span
										style={{
											fontStyle: "italic",
											fontWeight: 300,
											background: "linear-gradient(135deg, #818CF8, #C084FC)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
										}}
									>
										beautiful study notes
									</span>
								</h2>
								<p
									style={{
										fontSize: "15px",
										color: "#9CA3AF",
										maxWidth: "420px",
										margin: "0 auto",
										lineHeight: 1.6,
									}}
								>
									Upload a photo of your lecture slides, textbook pages, or
									whiteboard and let AI organize it into structured, readable
									notes.
								</p>
							</div>

							{preview && (
								<div style={{ textAlign: "center" }}>
									<PreviewThumbnail
										src={preview.url}
										onRemove={() => setPreview(null)}
									/>
									<br />
									<button
										onClick={() => processImage(preview.file)}
										style={{
											background: "linear-gradient(135deg, #818CF8, #6366F1)",
											color: "#fff",
											border: "none",
											borderRadius: "14px",
											padding: "14px 36px",
											cursor: "pointer",
											fontFamily: "'DM Sans', sans-serif",
											fontSize: "15px",
											fontWeight: 600,
											boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.transform = "translateY(-1px)")
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.transform = "translateY(0)")
										}
									>
										✨ Generate Notes
									</button>
								</div>
							)}

							{!preview && (
								<UploadZone
									onImageUpload={handleImageUpload}
									isDragging={isDragging}
									setIsDragging={setIsDragging}
								/>
							)}

							{error && (
								<div
									style={{
										marginTop: "20px",
										padding: "14px 20px",
										background: "#FEF2F2",
										borderRadius: "12px",
										border: "1px solid #FECACA",
										textAlign: "center",
									}}
								>
									<p
										style={{
											fontSize: "14px",
											color: "#DC2626",
											margin: 0,
										}}
									>
										{error}
									</p>
								</div>
							)}
						</>
					)}

					{loading && <LoadingState />}

					{currentNote && !loading && (
						<div>
							{/* Note title */}
							<div style={{ marginBottom: "36px" }}>
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: "12px",
										fontWeight: 600,
										color: "#818CF8",
										textTransform: "uppercase",
										letterSpacing: "0.1em",
										margin: "0 0 8px 0",
									}}
								>
									Lecture Notes
								</p>
								<h2
									style={{
										fontFamily: "'Newsreader', serif",
										fontSize: "34px",
										fontWeight: 400,
										color: "#1a1a2e",
										margin: 0,
										letterSpacing: "-0.02em",
										lineHeight: 1.2,
									}}
								>
									{currentNote.title}
								</h2>
								<div
									style={{
										width: "48px",
										height: "3px",
										background: "linear-gradient(90deg, #818CF8, #C084FC)",
										borderRadius: "2px",
										marginTop: "16px",
									}}
								/>
							</div>

							{/* Section cards */}
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "20px",
								}}
							>
								{currentNote.sections.map((section, i) => (
									<NoteCard key={i} section={section} index={i} />
								))}
							</div>

							{/* Footer */}
							<div
								style={{
									textAlign: "center",
									marginTop: "48px",
									paddingBottom: "40px",
								}}
							>
								<div
									style={{
										width: "32px",
										height: "1px",
										background: "#D1D5DB",
										margin: "0 auto 16px",
									}}
								/>
								<p
									style={{
										fontSize: "12px",
										color: "#C4C4C4",
										fontStyle: "italic",
										fontFamily: "'Newsreader', serif",
									}}
								>
									{currentNote.sections.length} sections · Generated by
									StudyNotes AI
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
