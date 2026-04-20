import { useEffect, useState } from "react";
import { typeColors } from "../../utils/constants";
import { StudyNoteSection } from "../../hooks/useStudyNotes";

type NoteCardProps = {
	section: StudyNoteSection;
	index: number;
	onSave: (section: StudyNoteSection) => void;
	onDelete: () => void;
};

function NoteCard({ section, index, onSave, onDelete }: NoteCardProps) {
	const tone = typeColors[section.type] || typeColors.concept;
	const [visible, setVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [draftSection, setDraftSection] = useState(section);

	useEffect(() => {
		setDraftSection(section);
	}, [section]);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 80 * index);
		return () => clearTimeout(t);
	}, [index]);

	const handleSave = () => {
		onSave(draftSection);
		setIsEditing(false);
	};

	const handleDelete = () => {
		onDelete();
		setShowDeleteConfirm(false);
	};

	const activeTone = typeColors[draftSection.type] || typeColors.concept;

	return (
		<article
			className={`note-card ${visible ? "note-card-visible" : ""}`}
			style={{
				["--note-accent" as string]: tone.border,
				["--note-accent-soft" as string]: tone.bg,
			}}
		>
			<div className="note-card-glow" />
			<div className="note-card-header">
				<div className="note-card-heading-group">
					<div
						className="note-type-badge"
						style={{
							background: activeTone.bg,
							color: activeTone.border,
						}}
					>
						<span>{activeTone.icon}</span>
						{activeTone.label}
					</div>
					{!isEditing ? <h3 className="note-card-title">{section.heading}</h3> : null}
				</div>

				<div className="note-card-actions">
					{isEditing ? (
						<>
							<button
								type="button"
								onClick={() => {
									setDraftSection(section);
									setIsEditing(false);
								}}
								className="note-card-button"
							>
								Cancel
							</button>
							<button type="button" onClick={handleSave} className="note-card-button note-card-button-primary">
								Save
							</button>
						</>
					) : (
						<>
							<button type="button" onClick={() => setIsEditing(true)} className="note-card-button">
								Edit
							</button>
							<button
								type="button"
								onClick={() => setShowDeleteConfirm(true)}
								className="note-card-button note-card-button-danger"
							>
								Delete
							</button>
						</>
					)}
				</div>
			</div>

			{showDeleteConfirm && (
				<div className="note-inline-warning">
					<p>Are you sure you want to delete this section?</p>
					<div className="note-inline-warning-actions">
						<button type="button" onClick={() => setShowDeleteConfirm(false)} className="note-card-button">
							Cancel
						</button>
						<button type="button" onClick={handleDelete} className="note-card-button note-card-button-danger-solid">
							Delete
						</button>
					</div>
				</div>
			)}

			{isEditing ? (
				<div className="note-edit-grid">
					<input
						value={draftSection.heading}
						onChange={(event) =>
							setDraftSection({
								...draftSection,
								heading: event.target.value,
							})
						}
						placeholder="Section heading"
						className="note-edit-input"
					/>
					<select
						value={draftSection.type}
						onChange={(event) =>
							setDraftSection({
								...draftSection,
								type: event.target.value as StudyNoteSection["type"],
							})
						}
						className="note-edit-input"
					>
						{Object.entries(typeColors).map(([key, value]) => (
							<option key={key} value={key}>
								{value.label}
							</option>
						))}
					</select>
					<textarea
						value={draftSection.content}
						onChange={(event) =>
							setDraftSection({
								...draftSection,
								content: event.target.value,
							})
						}
						placeholder="Section content"
						className="note-edit-textarea"
					/>
				</div>
			) : (
				<div className="note-card-body">
					{section.content.split("\n").map((line, lineIndex) => (
						<p key={lineIndex}>{line}</p>
					))}
				</div>
			)}
		</article>
	);
}

export default NoteCard;
