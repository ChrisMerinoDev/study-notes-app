"use client";

import { useState } from "react";
import type { StudyNote, StudyNoteSection } from "../hooks/useStudyNotes";
import { typeColors } from "../utils/constants";

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
				<div className="edit-note-header">
					<div>
						<p className="edit-note-eyebrow">Editor</p>
						<h2 className="edit-note-title">Refine your saved note</h2>
						<p className="edit-note-subtitle">
							Update the title, adjust section labels, and rewrite content without
							leaving the workspace.
						</p>
					</div>
					<button type="button" className="edit-note-close" onClick={onCancel}>
						Close
					</button>
				</div>

				<div className="edit-note-body">
					<div className="edit-note-summary">
						<label className="edit-note-label" htmlFor="note-title">
							Note title
						</label>
						<input
							id="note-title"
							className="edit-note-input"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Add a concise title"
						/>
						<p className="edit-note-meta">
							{sections.length} sections ready for review
						</p>
					</div>

					<div className="edit-note-sections">
						{sections.map((section, sectionIndex) => {
							const tone = typeColors[section.type] || typeColors.concept;

							return (
								<div key={sectionIndex} className="edit-section-card">
									<div className="edit-section-card-header">
										<span
											className="edit-section-badge"
											style={{
												background: tone.bg,
												color: tone.border,
											}}
										>
											<span>{tone.icon}</span>
											{tone.label}
										</span>
										<span className="edit-section-count">
											Section {sectionIndex + 1}
										</span>
									</div>

									<div className="edit-section-grid">
										<div>
											<label
												className="edit-note-label"
												htmlFor={`section-heading-${sectionIndex}`}
											>
												Heading
											</label>
											<input
												id={`section-heading-${sectionIndex}`}
												className="edit-note-input"
												value={section.heading}
												onChange={(event) =>
													handleSectionChange(
														sectionIndex,
														"heading",
														event.target.value,
													)
												}
												placeholder="Section heading"
											/>
										</div>

										<div>
											<label
												className="edit-note-label"
												htmlFor={`section-type-${sectionIndex}`}
											>
												Type
											</label>
											<select
												id={`section-type-${sectionIndex}`}
												className="edit-note-input"
												value={section.type}
												onChange={(event) =>
													handleSectionChange(
														sectionIndex,
														"type",
														event.target.value,
													)
												}
											>
												{Object.entries(typeColors).map(([key, value]) => (
													<option key={key} value={key}>
														{value.label}
													</option>
												))}
											</select>
										</div>
									</div>

									<div>
										<label
											className="edit-note-label"
											htmlFor={`section-content-${sectionIndex}`}
										>
											Content
										</label>
										<textarea
											id={`section-content-${sectionIndex}`}
											className="edit-note-textarea"
											value={section.content}
											onChange={(event) =>
												handleSectionChange(
													sectionIndex,
													"content",
													event.target.value,
												)
											}
											placeholder="Write or paste the section content"
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="edit-note-actions">
					<button type="button" onClick={onCancel} className="edit-note-button-secondary">
						Cancel
					</button>
					<button type="button" onClick={handleSave} className="edit-note-button-primary">
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}
