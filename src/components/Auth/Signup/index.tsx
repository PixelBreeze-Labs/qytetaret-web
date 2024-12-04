"use client";
import { useState } from "react";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
	const [signinOption, setSigninOption] = useState("magic-link");

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold mb-2">Create Account</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Join our community or report anonymously
				</p>
			</div>

			<div className="space-y-6">
				<GoogleSigninButton text='Sign up' />

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white dark:bg-gray-900 text-gray-500">OR</span>
					</div>
				</div>

				<div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
					<button
						onClick={() => setSigninOption("magic-link")}
						className={`h-[38px] w-full rounded-lg font-satoshi text-base font-medium tracking-[-.2px] ${
							signinOption === "magic-link"
								? "bg-primary/[.08] text-primary"
								: "text-dark dark:text-white"
						}`}
					>
						Magic Link
					</button>
					<button
						onClick={() => setSigninOption("password")}
						className={`h-[38px] w-full rounded-lg font-satoshi text-base font-medium tracking-[-.2px] ${
							signinOption === "password"
								? "bg-primary/[.08] text-primary"
								: "text-dark dark:text-white"
						}`}
					>
						Email
					</button>
				</div>

				{signinOption === "magic-link" ? (
					<SigninWithMagicLink />
				) : (
					<SignupWithPassword />
				)}

				<div className="text-center space-y-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Already have an account?{" "}
						<Link href="/auth/signin" className="text-primary hover:underline">
							Sign In →
						</Link>
					</p>

					<p className="text-sm text-gray-600 dark:text-gray-400">
						Want to report anonymously?{" "}
						<Link href="/reports/new" className="text-primary hover:underline">
							Continue as guest →
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}