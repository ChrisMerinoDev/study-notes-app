type PreviewThumbnailProps = {
	src: string;
	onRemove: () => void;
};

function PreviewThumbnail({ src, onRemove }: PreviewThumbnailProps) {
	return (
		<div
			style={{
				position: "relative",
				display: "inline-block",
				borderRadius: "12px",
				overflow: "hidden",
				border: "1px solid #E5E7EB",
				boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
				marginBottom: "24px",
			}}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt="Preview"
				style={{
					maxWidth: "100%",
					maxHeight: "200px",
					display: "block",
					objectFit: "contain",
				}}
			/>
			<button
				onClick={onRemove}
				style={{
					position: "absolute",
					top: "8px",
					right: "8px",
					background: "rgba(0,0,0,0.6)",
					color: "#fff",
					border: "none",
					borderRadius: "50%",
					width: "28px",
					height: "28px",
					cursor: "pointer",
					fontSize: "14px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backdropFilter: "blur(4px)",
				}}
			>
				✕
			</button>
		</div>
	);
}

export default PreviewThumbnail;
