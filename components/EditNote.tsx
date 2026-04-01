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
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.45)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 1000,
				padding: "20px",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: "800px",
					background: "#fff",
					borderRadius: "16px",
					padding: "24px",
					boxShadow: "0 18px 30px rgba(0,0,0,0.15)",
					overflow: "auto",
					maxHeight: "90vh",
				}}
			>
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
