type PreviewThumbnailProps = {
	src: string;
	onRemove: () => void;
};

function PreviewThumbnail({ src, onRemove }: PreviewThumbnailProps) {
	return (
		<div className="preview-thumbnail">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={src} alt="Preview" className="preview-thumbnail-image" />
			<button onClick={onRemove} className="preview-thumbnail-remove" type="button">
				Remove
			</button>
		</div>
	);
}

export default PreviewThumbnail;
