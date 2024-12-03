"use client";

import logo from "@/../public/images/logo/logo.svg";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
	return (
		<header className="fixed left-0 top-0 z-999 w-full bg-white py-4 shadow dark:bg-[#151F34]">
			<div className="mx-auto max-w-[1170px] flex items-center justify-between px-4">
				<Link href="/">
					<Image src={logo} alt="Qytetaret" className="w-[120px]" />
				</Link>

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
							<Link href="/reports/new" className="text-black hover:text-primary dark:text-white">
								Create Report
							</Link>
						</li>
					</ul>
				</nav>

				<div className="flex items-center gap-4">
					<ThemeSwitcher />
					<Link
						href="/auth/login"
						className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
					>
						Sign In
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;