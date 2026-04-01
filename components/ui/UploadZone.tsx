import { useRef, useCallback, type DragEvent, type ChangeEvent } from "react";

type UploadZoneProps = {
	onImageUpload: (file: File) => void;
	isDragging: boolean;
	setIsDragging: (value: boolean) => void;
};

function UploadZone({
	onImageUpload,
	isDragging,
	setIsDragging,
}: UploadZoneProps) {
	const fileRef = useRef<HTMLInputElement | null>(null);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file && file.type.startsWith("image/")) onImageUpload(file);
		},
		[onImageUpload, setIsDragging],
	);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(true);
		},
		[setIsDragging],
	);

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={() => setIsDragging(false)}
			onClick={() => fileRef.current?.click()}
			style={{
				border: `2px dashed ${isDragging ? "#818CF8" : "#D1D5DB"}`,
				borderRadius: "20px",
				padding: "56px 40px",
				textAlign: "center",
				cursor: "pointer",
				background: isDragging ? "#EEF2FF" : "rgba(255,255,255,0.7)",
				backdropFilter: "blur(8px)",
				transition: "all 0.3s ease",
				transform: isDragging ? "scale(1.01)" : "scale(1)",
			}}
		>
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					const file = e.target.files?.[0];
					if (file) onImageUpload(file);
				}}
			/>
			<div
				style={{
					fontSize: "48px",
					marginBottom: "16px",
					filter: "grayscale(0.2)",
				}}
			>
				📸
			</div>
			<p
				style={{
					fontFamily: "'Newsreader', serif",
					fontSize: "22px",
					fontWeight: 400,
					color: "#1a1a2e",
					margin: "0 0 8px 0",
				}}
			>
				Drop your lecture screenshot here
			</p>
			<p
				style={{
					fontFamily: "'DM Sans', sans-serif",
					fontSize: "14px",
					color: "#9CA3AF",
					margin: 0,
				}}
			>
				or click to browse · PNG, JPG, WEBP
			</p>
		</div>
	);
}

export default UploadZone;
