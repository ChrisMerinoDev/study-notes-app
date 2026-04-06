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
	if (notes.length === 0) return null;
	return (
		<div style={{ marginBottom: "32px" }}>
			<h4
				style={{
					fontFamily: "'DM Sans', sans-serif",
					fontSize: "11px",
					fontWeight: 700,
					color: "#9CA3AF",
					textTransform: "uppercase",
					letterSpacing: "0.1em",
					margin: "0 0 12px 0",
				}}
			>
				Saved Notes ({notes.length})
			</h4>
			<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
				{notes.map((note, i) => (
					<div
						key={note.id}
						onClick={() => onSelect(i)}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "10px 14px",
							borderRadius: "10px",
							cursor: "pointer",
							background: activeId === note.id ? "#EEF2FF" : "transparent",
							border:
								activeId === note.id
									? "1px solid #C7D2FE"
									: "1px solid transparent",
							transition: "all 0.2s ease",
						}}
					>
						<span
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "13px",
								fontWeight: 500,
								color: activeId === note.id ? "#4338CA" : "#4B5563",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								maxWidth: "120px",
							}}
						>
							{note.title}
						</span>
						<div style={{ display: "flex", gap: "4px" }}>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onEdit(i);
								}}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#D1D5DB",
									fontSize: "12px",
									padding: "2px",
									transition: "color 0.2s",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = "#F59E0B")}
								onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
							>
								✏️
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onDelete(note);
								}}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#D1D5DB",
									fontSize: "14px",
									padding: "2px",
									transition: "color 0.2s",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
								onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
							>
								✕
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default SavedNotes;
