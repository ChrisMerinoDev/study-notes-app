// Subtle animated background
function PaperTexture() {
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 0,
				pointerEvents: "none",
				background: `
        radial-gradient(ellipse at 20% 50%, rgba(120,119,198,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(255,177,153,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(99,179,237,0.04) 0%, transparent 50%),
        linear-gradient(180deg, #FAFAF9 0%, #F5F5F0 100%)
      `,
			}}
		/>
	);
}

export default PaperTexture;
