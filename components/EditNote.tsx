"use client";

import { useState } from "react";
import type { StudyNote, StudyNoteSection } from "../hooks/useStudyNotes";

type EditNoteProps = {
	note: StudyNote;
	onSave: (note: StudyNote) => void;
	onCancel: () => void;
};

export default function EditNote({ note, onSave, onCancel }: EditNoteProps) {
	const [title, setTitle] = useState(note.title);
	const [sections, setSections] = useState(note.sections);

	const handleSectionChange = (
		index: number,
		key: keyof StudyNoteSection,
		value: string,
	) => {
		const next = sections.map((section, idx) =>
			idx === index
				? {
						...section,
						[key]: value,
					}
				: section,
		);
		setSections(next);
	};

	const handleSave = () => {
		onSave({ title, sections });
	};

	return (
		<div className="edit-note-overlay">
			<div className="edit-note-modal">
				<h2 style={{ marginBottom: "16px" }}>Edit note</h2>
				<input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					style={{
						width: "100%",
						padding: "12px",
						borderRadius: "10px",
						border: "1px solid #D1D5DB",
						marginBottom: "16px",
					}}
				/>

				{sections.map((section, sectionIndex) => (
					<div key={sectionIndex} style={{ marginBottom: "16px" }}>
						<input
							value={section.heading}
							onChange={(event) =>
								handleSectionChange(sectionIndex, "heading", event.target.value)
							}
							style={{
								width: "100%",
								padding: "10px",
								marginBottom: "8px",
							}}
						/>
						<input
							value={section.type}
							onChange={(event) =>
								handleSectionChange(sectionIndex, "type", event.target.value)
							}
							style={{
								width: "100%",
								padding: "10px",
								marginBottom: "8px",
							}}
						/>
						<textarea
							value={section.content}
							onChange={(event) =>
								handleSectionChange(sectionIndex, "content", event.target.value)
							}
							style={{
								width: "100%",
								padding: "10px",
								height: "110px",
							}}
						/>
					</div>
				))}

				<div
					style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
				>
					<button
						type="button"
						onClick={onCancel}
						style={{ padding: "10px 18px" }}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSave}
						style={{
							padding: "10px 18px",
							background: "#1a1a2e",
							color: "white",
							border: "none",
							borderRadius: "8px",
						}}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
