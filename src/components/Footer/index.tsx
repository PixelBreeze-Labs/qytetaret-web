import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/images/logo/logo.svg";


const Footer = () => {
	return (
		<footer className="mt-auto bg-gray-50 dark:bg-[#1a1f2c] border-t dark:border-gray-800">
			<div className="mx-auto max-w-[1170px] px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-2">
						<Image src={logo} alt="Qytetaret" className="w-[120px] mb-4" />
						<p className="text-gray-600 dark:text-gray-400">
							Community reporting platform enabling anonymous reporting and tracking of local issues.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-black dark:text-white mb-4">Platform</h3>
						<ul className="space-y-2">
							<li><Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-400">About</Link></li>
							<li><Link href="/help" className="text-gray-600 hover:text-primary dark:text-gray-400">How it Works</Link></li>
							<li><Link href="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400">Privacy</Link></li>
							<li><Link href="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400">Terms</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="font-bold text-black dark:text-white mb-4">Contact</h3>
						<ul className="space-y-2">
							<li><Link href="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400">Contact Us</Link></li>
							<li><Link href="/faq" className="text-gray-600 hover:text-primary dark:text-gray-400">FAQ</Link></li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							© 2024 Qytetaret. All rights reserved.
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Disclaimer: User-generated reports are not verified by Qytetaret
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
