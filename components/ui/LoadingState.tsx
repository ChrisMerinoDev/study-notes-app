import { useState, useEffect } from "react";

function LoadingState() {
	const [dots, setDots] = useState("");
	const messages = [
		"Reading your screenshot…",
		"Identifying key concepts…",
		"Organizing into sections…",
		"Formatting your notes…",
	];
	const [msgIdx, setMsgIdx] = useState(0);

	useEffect(() => {
		const d = setInterval(
			() => setDots((p) => (p.length >= 3 ? "" : p + ".")),
			400,
		);
		const m = setInterval(
			() => setMsgIdx((p) => (p + 1) % messages.length),
			2200,
		);
		return () => {
			clearInterval(d);
			clearInterval(m);
		};
	}, [messages.length]);

	return (
		<div
			style={{
				textAlign: "center",
				padding: "80px 20px",
			}}
		>
			{/* Spinner */}
			<div
				style={{
					marginBottom: "32px",
					position: "relative",
					width: "64px",
					height: "64px",
					margin: "0 auto 32px",
				}}
			>
				<div
					style={{
						width: "64px",
						height: "64px",
						border: "3px solid #EEF2FF",
						borderTopColor: "#818CF8",
						borderRadius: "50%",
						animation: "spin 1s linear infinite",
					}}
				/>
			</div>
			<p
				style={{
					fontFamily: "'Newsreader', serif",
					fontSize: "20px",
					color: "#1a1a2e",
					margin: "0 0 6px 0",
					minHeight: "30px",
				}}
			>
				{messages[msgIdx]}
				{dots}
			</p>
			<p
				style={{
					fontFamily: "'DM Sans', sans-serif",
					fontSize: "13px",
					color: "#9CA3AF",
				}}
			>
				AI is analyzing your image
			</p>
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</div>
	);
}

export default LoadingState;
