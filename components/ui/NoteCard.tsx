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
	const type = typeColors[section.type] || typeColors.concept;
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

	const activeType = typeColors[draftSection.type] || typeColors.concept;
	const actionButtonStyle = {
		border: "1px solid #E5E7EB",
		borderRadius: "999px",
		padding: "6px 12px",
		background: "#FFFFFF",
		color: "#4B5563",
		cursor: "pointer",
		fontFamily: "'DM Sans', sans-serif",
		fontSize: "12px",
		fontWeight: 600,
	};

	return (
		<div
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0)" : "translateY(24px)",
				transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
				background: "#FFFFFF",
				borderRadius: "16px",
				border: `1px solid ${type.border}33`,
				borderLeft: `4px solid ${type.border}`,
				padding: "28px 32px",
				boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.03)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Accent glow */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "120px",
					height: "120px",
					background: `radial-gradient(circle, ${type.border}11 0%, transparent 70%)`,
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "12px",
					marginBottom: "14px",
				}}
			>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
						background: activeType.bg,
						borderRadius: "20px",
						padding: "4px 14px 4px 8px",
						fontSize: "12px",
						fontFamily: "'DM Sans', sans-serif",
						fontWeight: 600,
						color: activeType.border,
						letterSpacing: "0.03em",
						textTransform: "uppercase",
					}}
				>
					<span style={{ fontSize: "14px" }}>{activeType.icon}</span>
					{activeType.label}
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					{isEditing ? (
						<>
							<button
								type="button"
								onClick={() => {
									setDraftSection(section);
									setIsEditing(false);
								}}
								style={actionButtonStyle}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSave}
								style={{
									...actionButtonStyle,
									background: "#1a1a2e",
									borderColor: "#1a1a2e",
									color: "#FFFFFF",
								}}
							>
								Save
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								style={actionButtonStyle}
							>
								Edit
							</button>
							<button
								type="button"
								onClick={() => setShowDeleteConfirm(true)}
								style={{
									...actionButtonStyle,
									color: "#DC2626",
									borderColor: "#FECACA",
								}}
							>
								Delete
							</button>
						</>
					)}
				</div>
			</div>

			{showDeleteConfirm && (
				<div
					style={{
						marginBottom: "18px",
						padding: "16px 18px",
						borderRadius: "16px",
						background: "#FFF7F7",
						border: "1px solid #FECACA",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: "12px",
						flexWrap: "wrap",
					}}
				>
					<p
						style={{
							margin: 0,
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "14px",
							lineHeight: 1.6,
							color: "#991B1B",
							fontWeight: 500,
						}}
					>
						Are you sure you want to delete this section?
					</p>
					<div style={{ display: "flex", gap: "8px" }}>
						<button
							type="button"
							onClick={() => setShowDeleteConfirm(false)}
							style={actionButtonStyle}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleDelete}
							style={{
								...actionButtonStyle,
								background: "#DC2626",
								borderColor: "#DC2626",
								color: "#FFFFFF",
							}}
						>
							Delete
						</button>
					</div>
				</div>
			)}

			{isEditing ? (
				<div style={{ display: "grid", gap: "12px" }}>
					<input
						value={draftSection.heading}
						onChange={(event) =>
							setDraftSection({
								...draftSection,
								heading: event.target.value,
							})
						}
						placeholder="Section heading"
						style={{
							width: "100%",
							padding: "12px 14px",
							borderRadius: "10px",
							border: "1px solid #D1D5DB",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "15px",
							color: "#1a1a2e",
							background: "#FFFFFF",
						}}
					/>
					<select
						value={draftSection.type}
						onChange={(event) =>
							setDraftSection({
								...draftSection,
								type: event.target.value as StudyNoteSection["type"],
							})
						}
						style={{
							width: "100%",
							padding: "12px 14px",
							borderRadius: "10px",
							border: "1px solid #D1D5DB",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "15px",
							color: "#1a1a2e",
							background: "#FFFFFF",
						}}
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
						style={{
							width: "100%",
							minHeight: "180px",
							padding: "14px",
							borderRadius: "12px",
							border: "1px solid #D1D5DB",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "15px",
							lineHeight: 1.7,
							color: "#1a1a2e",
							resize: "vertical",
							background: "#FFFFFF",
						}}
					/>
				</div>
			) : (
				<>
					{/* Heading */}
					<h3
						style={{
							fontFamily: "'Newsreader', Georgia, serif",
							fontSize: "22px",
							fontWeight: 500,
							color: "#1a1a2e",
							margin: "0 0 14px 0",
							lineHeight: 1.3,
							letterSpacing: "-0.01em",
						}}
					>
						{section.heading}
					</h3>

					{/* Content */}
					<div
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "15px",
							lineHeight: 1.75,
							color: "#3d3d56",
							fontWeight: 400,
							letterSpacing: "0.005em",
						}}
					>
						{section.content.split("\n").map((line, i) => {
							if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;
							const isBullet =
								line.trim().startsWith("•") ||
								line.trim().startsWith("-") ||
								line.trim().startsWith("*");
							if (isBullet) {
								return (
									<div
										key={i}
										style={{
											display: "flex",
											gap: "10px",
											marginBottom: "4px",
											paddingLeft: "4px",
										}}
									>
										<span
											style={{
												color: activeType.border,
												fontWeight: 600,
												flexShrink: 0,
											}}
										>
											•
										</span>
										<span>{line.trim().replace(/^[•\-*]\s*/, "")}</span>
									</div>
								);
							}
							const isFormula =
								/[=+\-*/^∫∑∏√≈≠≤≥∞]/.test(line) && line.length < 100;
							if (section.type === "formula" || isFormula) {
								return (
									<div
										key={i}
										style={{
											fontFamily: "'JetBrains Mono', monospace",
											fontSize: "14px",
											background: "#F8F8FC",
											padding: "8px 14px",
											borderRadius: "8px",
											marginBottom: "6px",
											color: "#2d2b55",
											border: "1px solid #E8E8F0",
										}}
									>
										{line}
									</div>
								);
							}
							return (
								<p key={i} style={{ margin: "0 0 6px 0" }}>
									{line}
								</p>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}

export default NoteCard;
