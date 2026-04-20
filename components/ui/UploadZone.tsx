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
			className={`upload-zone ${isDragging ? "upload-zone-dragging" : ""}`}
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
			<div className="upload-icon-wrap">
				<div className="upload-icon-core">+</div>
			</div>
			<p className="upload-title">Drop your lecture screenshot here</p>
			<p className="upload-description">or click to browse PNG, JPG, and WEBP files</p>
			<div className="upload-specs">
				<span>Lecture slides</span>
				<span>Textbook pages</span>
				<span>Whiteboards</span>
			</div>
		</div>
	);
}

export default UploadZone;
