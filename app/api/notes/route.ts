import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
			return NextResponse.json(
				{
					error:
						"Missing Supabase environment variables. Expected NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
				},
				{ status: 500 },
			);
		}

		const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "No authorization token" },
				{ status: 401 },
			);
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser(token);

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Invalid or expired session" },
				{ status: 401 },
			);
		}

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
