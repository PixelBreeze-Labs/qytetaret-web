"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/images/logo/logo-new.png";
import { useTranslations } from 'next-intl';

const Footer = () => {
	const t = useTranslations('footer');

	return (
		<footer className="mt-auto bg-gray-50 dark:bg-dark-3 border-t border-gray-100 dark:border-gray-800 relative">
			{/* Gradient separator */}
			<div
				className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-200"/>

			<div className="mx-auto max-w-[1170px] px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-2">
						<Image src={logo} alt="Qytetaret"
							   className="w-[60px] mb-4 dark:brightness-200 dark:contrast-200 dark:border dark:border-white"/>
						<p className="text-gray-600 dark:text-gray-300">
							{t('description')}
						</p>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('platform.title')}</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/about"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('platform.about')}
								</Link>
							</li>
							<li>
								<Link href="/help"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('platform.howItWorks')}
								</Link>
							</li>
							<li>
								<Link href="/privacy"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('platform.privacy')}
								</Link>
							</li>
							<li>
								<Link href="/terms"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('platform.terms')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/contact"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('contact.contactUs')}
								</Link>
							</li>
							<li>
								<Link href="/faq"
									  className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
									{t('contact.faq')}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
							{t('copyright')}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
							{t('disclaimer')}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;