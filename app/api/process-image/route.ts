import { NextResponse } from "next/server";

type ProcessImageRequestBody = {
	base64: string;
	mediaType: string;
};

type SectionType =
	| "concept"
	| "definition"
	| "formula"
	| "example"
	| "keypoint"
	| "summary";

type StudyNoteSection = {
	heading: string;
	type: SectionType;
	content: string;
};

type StudyNote = {
	title: string;
	sections: StudyNoteSection[];
};

export async function POST(request: Request) {
	try {
		const { base64, mediaType } =
			(await request.json()) as ProcessImageRequestBody;

		if (!process.env.GOOGLE_AI_API_KEY) {
			return NextResponse.json(
				{ error: "Missing GOOGLE_AI_API_KEY" },
				{ status: 500 },
			);
		}

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									inline_data: {
										mime_type: mediaType,
										data: base64,
									},
								},
								{
									text: 'Extract and organize all text from this image into structured study notes. Return ONLY a valid JSON object with this exact shape: {"title": "Concise lecture/topic title", "sections": [{"heading": "Section heading", "type": "concept|definition|formula|example|keypoint|summary", "content": "The note content in plain text. Use \\n for line breaks if needed."}]}',
								},
							],
						},
					],
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
		const clean = text.replace(/```json|```/g, "").trim();
		const parsed = JSON.parse(clean) as StudyNote;

		return NextResponse.json(parsed);
	} catch (error: unknown) {
		console.error(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
