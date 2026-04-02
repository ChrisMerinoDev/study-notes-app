"use client";

import { useState, FormEvent } from "react";
import { createClient } from "../lib/supabase";
import { FONTS_LINK } from "../utils/constants";

type AuthProps = {
	onAuth: () => void;
};

export default function Auth({ onAuth }: AuthProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const supabase = createClient();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isSignUp) {
				const { error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				alert("Check your email for confirmation!");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				onAuth();
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-overlay">
			<link href={FONTS_LINK} rel="stylesheet" />
			<div className="auth-modal">
				<h2
					style={{
						textAlign: "center",
						marginBottom: "8px",
						fontFamily: "'Newsreader', serif",
						fontSize: "32px",
						fontWeight: 500,
						color: "#111111",
						letterSpacing: "-0.03em",
					}}
				>
					{isSignUp ? "Sign Up" : "Sign In"}
				</h2>
				<p
					style={{
						textAlign: "center",
						margin: "0 0 24px 0",
						fontSize: "14px",
						lineHeight: 1.6,
						color: "#4B5563",
						fontFamily: "'DM Sans', sans-serif",
					}}
				>
					{isSignUp
						? "Create an account to keep your notes synced."
						: "Sign in to access your saved study notes."}
				</p>
				<form onSubmit={handleSubmit}>
					<input
						className="auth-input"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{
							marginBottom: "12px",
						}}
					/>
					<input
						className="auth-input"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{
							marginBottom: "18px",
						}}
					/>
					{error && (
						<p
							style={{
								color: "#DC2626",
								fontSize: "14px",
								marginBottom: "12px",
								textAlign: "center",
							}}
						>
							{error}
						</p>
					)}
					<button
						className="auth-submit"
						type="submit"
						disabled={loading}
						style={{
							cursor: loading ? "not-allowed" : "pointer",
							opacity: loading ? 0.7 : 1,
						}}
					>
						{loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
					</button>
				</form>
				<p
					style={{
						textAlign: "center",
						marginTop: "16px",
						fontSize: "14px",
						color: "#6B7280",
					}}
				>
					{isSignUp ? "Already have an account?" : "Don't have an account?"}
					<button
						type="button"
						onClick={() => setIsSignUp(!isSignUp)}
						style={{
							background: "none",
							border: "none",
							color: "#111111",
							cursor: "pointer",
							textDecoration: "underline",
							fontWeight: 600,
							fontFamily: "'DM Sans', sans-serif",
						}}
					>
						{isSignUp ? "Sign In" : "Sign Up"}
					</button>
				</p>
			</div>
		</div>
	);
}
