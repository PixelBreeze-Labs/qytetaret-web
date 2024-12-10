"use client";
import logo from "@/../public/images/logo/logo-new.png";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from 'next-intl';

const Header = () => {
	const t = useTranslations('navigation');
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header
			className="fixed left-0 top-0 z-999 w-full bg-white py-4 shadow dark:shadow-[0_3px_15px_rgba(255,255,255,0.15)] dark:bg-dark-3">
			<div className="mx-auto max-w-[1170px] flex items-center justify-between px-4">
				<Link href="/">
					<Image
						src={logo}
						alt="Qytetaret"
						className="w-[60px] dark:brightness-200 dark:contrast-200 dark:border dark:border-white dark:rounded"
					/>
				</Link>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-black dark:text-white p-2"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle menu"
				>
					{!isMenuOpen ? (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
								  d="M4 6h16M4 12h16m-7 6h7"/>
						</svg>
					) : (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
								  d="M6 18L18 6M6 6l12 12"/>
						</svg>
					)}
				</button>

				{/* Desktop Navigation */}
				<nav className="hidden md:block">
					<ul className="flex items-center gap-6">
						<li>
							<Link href="/reports" className="text-black hover:text-primary dark:text-white">
								{t('reports')}
							</Link>
						</li>
						<li>
							<Link href="/map" className="text-black hover:text-primary dark:text-white">
								{t('map')}
							</Link>
						</li>
						<li>
							<Link
								href="/reports/new"
								className="relative px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium group"
							>
								{/*<span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75 group-hover:opacity-0"></span>*/}
								{t('submitReport')}
							</Link>

						</li>
					</ul>
				</nav>

				<div className="hidden md:flex items-center gap-4">
					<LocaleSwitcher/>
					<ThemeSwitcher/>
					<Link
						href="/auth/signin"
						className="px-4 py-2 rounded-full bg-body text-white hover:bg-body/90 transition-colors"
					>
						{t('signIn')}
					</Link>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="absolute top-full left-0 right-0 bg-white dark:bg-dark shadow-lg md:hidden">
						<nav className="px-4 py-3">
							<ul className="flex flex-col gap-4">
								<li>
									<Link
										href="/reports"
										className="text-black hover:text-primary dark:text-white block py-2"
										onClick={() => setIsMenuOpen(false)}
									>
										{t('reports')}
									</Link>
								</li>
								<li>
									<Link
										href="/map"
										className="text-black hover:text-primary dark:text-white block py-2"
										onClick={() => setIsMenuOpen(false)}
									>
										{t('map')}
									</Link>
								</li>
								<li>
									<Link
										href="/reports/new"
										className="block text-center px-4 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										{t('submitReport')}
									</Link>
								</li>
								<li className="flex items-center justify-between py-2">
									<LocaleSwitcher/>
									<ThemeSwitcher/>
									<Link
										href="/auth/signin"
										className="px-4 py-2 rounded-full bg-body text-white hover:bg-body/90 transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										{t('signIn')}
									</Link>
								</li>
							</ul>
						</nav>
					</div>
				)}
			</div>

		</header>
	);
};

export default Header;