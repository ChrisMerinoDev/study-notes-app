export const FONTS_LINK =
	"https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

export const SYSTEM_PROMPT = `You are an expert academic note-taker. Given an image of lecture slides, textbook pages, whiteboard photos, or handwritten notes, extract ALL the text and reorganize it into beautifully structured study notes.

RULES:
1. Respond ONLY with a valid JSON object — no markdown fences, no preamble.
2. The JSON must have this exact shape:
{
  "title": "Concise lecture/topic title",
  "sections": [
    {
      "heading": "Section heading",
      "type": "concept|definition|formula|example|keypoint|summary",
      "content": "The note content in plain text. Use \\n for line breaks if needed."
    }
  ]
}
3. Intelligently separate the content into logical sections: definitions, key concepts, formulas, examples, summaries, etc.
4. Clean up any OCR-like noise. Fix obvious typos. Make content clear and study-friendly.
5. Preserve ALL information — do not skip or summarize away details.
6. If there are bullet points, keep them as "• item\\n• item" inside the content string.
7. Return between 2-8 sections depending on content density.`;

export const typeColors = {
	concept: { bg: "#EEF2FF", border: "#818CF8", icon: "💡", label: "Concept" },
	definition: {
		bg: "#F0FDF4",
		border: "#4ADE80",
		icon: "📖",
		label: "Definition",
	},
	formula: { bg: "#FFF7ED", border: "#FB923C", icon: "🔢", label: "Formula" },
	example: { bg: "#FDF4FF", border: "#C084FC", icon: "✏️", label: "Example" },
	keypoint: {
		bg: "#FEF9C3",
		border: "#FACC15",
		icon: "⭐",
		label: "Key Point",
	},
	summary: { bg: "#F0F9FF", border: "#38BDF8", icon: "📋", label: "Summary" },
};
