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
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(255,255,255,0.95)",
				backdropFilter: "blur(10px)",
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					background: "#fff",
					padding: "40px",
					borderRadius: "16px",
					boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
					width: "100%",
					maxWidth: "400px",
				}}
			>
				<h2
					style={{
						textAlign: "center",
						marginBottom: "24px",
						fontFamily: "'Newsreader', serif",
						fontSize: "28px",
						color: "#1a1a2e",
					}}
				>
					{isSignUp ? "Sign Up" : "Sign In"}
				</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "12px 16px",
							marginBottom: "12px",
							border: "1px solid #D1D5DB",
							borderRadius: "8px",
							fontSize: "16px",
							fontFamily: "'DM Sans', sans-serif",
						}}
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "12px 16px",
							marginBottom: "20px",
							border: "1px solid #D1D5DB",
							borderRadius: "8px",
							fontSize: "16px",
							fontFamily: "'DM Sans', sans-serif",
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
						type="submit"
						disabled={loading}
						style={{
							width: "100%",
							padding: "12px",
							background: "#1a1a2e",
							color: "#fff",
							border: "none",
							borderRadius: "8px",
							fontSize: "16px",
							fontFamily: "'DM Sans', sans-serif",
							fontWeight: 600,
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
							color: "#818CF8",
							cursor: "pointer",
							textDecoration: "underline",
						}}
					>
						{isSignUp ? "Sign In" : "Sign Up"}
					</button>
				</p>
			</div>
		</div>
	);
}
