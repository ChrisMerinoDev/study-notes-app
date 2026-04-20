import { useState, useEffect } from "react";

function LoadingState() {
	const [dots, setDots] = useState("");
	const messages = [
		"Reading your screenshot",
		"Identifying key concepts",
		"Organizing the material",
		"Formatting the final note",
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
		<div className="loading-shell">
			<div className="loading-orb" aria-hidden="true">
				<div className="loading-orb-ring loading-orb-ring-outer" />
				<div className="loading-orb-ring loading-orb-ring-inner" />
			</div>
			<p className="loading-title">
				{messages[msgIdx]}
				{dots}
			</p>
			<p className="loading-copy">AI is turning the image into structured, editable notes.</p>
		</div>
	);
}

export default LoadingState;
