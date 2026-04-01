import { useState, useEffect } from "react";
import { typeColors } from "../../utils/constants";
import { StudyNoteSection } from "../../hooks/useStudyNotes";

type NoteCardProps = {
	section: StudyNoteSection;
	index: number;
};

function NoteCard({ section, index }: NoteCardProps) {
	const type = typeColors[section.type] || typeColors.concept;
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 80 * index);
		return () => clearTimeout(t);
	}, [index]);

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

			{/* Type badge */}
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: "6px",
					background: type.bg,
					borderRadius: "20px",
					padding: "4px 14px 4px 8px",
					marginBottom: "14px",
					fontSize: "12px",
					fontFamily: "'DM Sans', sans-serif",
					fontWeight: 600,
					color: type.border,
					letterSpacing: "0.03em",
					textTransform: "uppercase",
				}}
			>
				<span style={{ fontSize: "14px" }}>{type.icon}</span>
				{type.label}
			</div>

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
									style={{ color: type.border, fontWeight: 600, flexShrink: 0 }}
								>
									•
								</span>
								<span>{line.trim().replace(/^[•\-*]\s*/, "")}</span>
							</div>
						);
					}
					// Detect formula-like content
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
		</div>
	);
}

export default NoteCard;
