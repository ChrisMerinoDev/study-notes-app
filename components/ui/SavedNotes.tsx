import type { DbNote } from "../../hooks/useStudyNotes";

type SavedNotesProps = {
	notes: DbNote[];
	activeId: string | null;
	onSelect: (index: number) => void;
	onEdit: (index: number) => void;
	onDelete: (note: DbNote) => void;
};

function SavedNotes({
	notes,
	activeId,
	onSelect,
	onEdit,
	onDelete,
}: SavedNotesProps) {
	if (notes.length === 0) {
		return (
			<div className="saved-notes-empty">
				<p>No saved notes yet. Your generated notes will appear here.</p>
			</div>
		);
	}

	return (
		<div className="saved-notes-list">
			{notes.map((note, i) => {
				const isActive = activeId === note.id;
				const updatedLabel = new Date(
					note.updated_at ?? note.created_at,
				).toLocaleDateString("en-US", { month: "short", day: "numeric" });

				return (
					<div
						key={note.id}
						onClick={() => onSelect(i)}
						className={`saved-note-item ${isActive ? "saved-note-item-active" : ""}`}
					>
						<div className="saved-note-copy">
							<p className="saved-note-title">{note.title}</p>
							<p className="saved-note-meta">Updated {updatedLabel}</p>
						</div>
						<div className="saved-note-actions">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onEdit(i);
								}}
								className="saved-note-icon-button"
								aria-label={`Edit ${note.title}`}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(note);
								}}
								className="saved-note-icon-button saved-note-icon-button-danger"
								aria-label={`Delete ${note.title}`}
							>
								Delete
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default SavedNotes;
