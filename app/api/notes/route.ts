import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side operations
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: Request) {
	try {
		// Get the auth token from the Authorization header
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "No authorization token" },
				{ status: 401 },
			);
		}

		// Create a client with the user's token to verify their session
		const userClient = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				global: {
					headers: {
						authorization: `Bearer ${token}`,
					},
				},
			},
		);

		// Verify the session by getting the user
		const {
			data: { user },
			error: authError,
		} = await userClient.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Invalid or expired session" },
				{ status: 401 },
			);
		}

		// Fetch notes for this specific user
		const { data: notes, error: notesError } = await supabase
			.from("notes")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (notesError) {
			return NextResponse.json({ error: notesError.message }, { status: 400 });
		}

		return NextResponse.json({ notes });
	} catch (error: unknown) {
		console.error(error);
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
