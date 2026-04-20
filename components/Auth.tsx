"use client";

import { useState, FormEvent } from "react";
import { createClient } from "../lib/supabase";

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
			<div className="auth-modal">
				<div className="auth-badge">StudyNotes</div>
				<h2 className="auth-title">{isSignUp ? "Create your account" : "Welcome back"}</h2>
				<p className="auth-copy">
					{isSignUp
						? "Create an account to save, revisit, and refine your notes from any device."
						: "Sign in to access your saved study notes and continue editing where you left off."}
				</p>
				<form onSubmit={handleSubmit} className="auth-form">
					<input
						className="auth-input"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						className="auth-input"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{error && <p className="auth-error">{error}</p>}
					<button
						className="auth-submit"
						type="submit"
						disabled={loading}
					>
						{loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
					</button>
				</form>
				<p className="auth-switch-copy">
					{isSignUp ? "Already have an account?" : "Need an account?"}
					<button
						type="button"
						onClick={() => setIsSignUp(!isSignUp)}
						className="auth-switch-button"
					>
						{isSignUp ? "Sign In" : "Sign Up"}
					</button>
				</p>
			</div>
		</div>
	);
}
