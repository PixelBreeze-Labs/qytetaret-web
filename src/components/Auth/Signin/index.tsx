"use client";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	const t = useTranslations('auth');
	const [signinOption, setSigninOption] = useState("magic-link");

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold mb-2">{t('signin.title')}</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{t('signin.description')}
				</p>
			</div>

			<div className="space-y-6">
				<GoogleSigninButton text={t('signin.googleButton')} />

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                            {t('common.or')}
                        </span>
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
						{t('common.magicLink')}
					</button>
					<button
						onClick={() => setSigninOption("password")}
						className={`h-[38px] w-full rounded-lg font-satoshi text-base font-medium tracking-[-.2px] ${
							signinOption === "password"
								? "bg-primary/[.08] text-primary"
								: "text-dark dark:text-white"
						}`}
					>
						{t('common.password')}
					</button>
				</div>

				{signinOption === "magic-link" ? (
					<SigninWithMagicLink />
				) : (
					<SigninWithPassword />
				)}

				<div className="text-center space-y-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{t('signin.noAccount')}{" "}
						<Link href="/auth/signup" className="text-primary hover:underline">
							{t('signin.createAccount')}
						</Link>
					</p>

					<p className="text-sm text-gray-600 dark:text-gray-400">
						{t('signin.anonymousReport')}{" "}
						<Link href="/reports/new" className="text-primary hover:underline">
							{t('signin.continueAsGuest')}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}