"use client";

import logo from "@/../public/images/logo/logo-new.png";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="fixed left-0 top-0 z-999 w-full bg-white py-4 shadow dark:bg-dark">
			<div className="mx-auto max-w-[1170px] flex items-center justify-between px-4">
				<Link href="/">
					<Image src={logo} alt="Qytetaret" className="w-[60px]" />
				</Link>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-black dark:text-white p-2"
					onClick={toggleMenu}
					aria-label="Toggle menu"
				>
					{!isMenuOpen ? (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
						</svg>
					) : (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					)}
				</button>

				{/* Desktop Navigation */}
				<nav className="hidden md:block">
					<ul className="flex items-center gap-6">
						<li>
							<Link href="/reports" className="text-black hover:text-primary dark:text-white">
								Reports
							</Link>
						</li>
						<li>
							<Link href="/map" className="text-black hover:text-primary dark:text-white">
								Map
							</Link>
						</li>
						<li>
							<Link
								href="/reports/new"
								className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
							>
								Submit Report
							</Link>
						</li>
					</ul>
				</nav>

				<div className="hidden md:flex items-center gap-4">
					<ThemeSwitcher />
					<Link
						href="/auth/signin"
						className="px-4 py-2 rounded-full bg-body text-white hover:bg-body/90 transition-colors"
					>
						Sign In
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
										Reports
									</Link>
								</li>
								<li>
									<Link
										href="/map"
										className="text-black hover:text-primary dark:text-white block py-2"
										onClick={() => setIsMenuOpen(false)}
									>
										Map
									</Link>
								</li>
								<li>
									<Link
										href="/reports/new"
										className="block text-center px-4 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										Submit Report
									</Link>
								</li>
								<li className="flex items-center justify-between py-2">
									<ThemeSwitcher />
									<Link
										href="/auth/signin"
										className="px-4 py-2 rounded-full bg-body text-white hover:bg-body/90 transition-colors"
										onClick={() => setIsMenuOpen(false)}
									>
										Sign In
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