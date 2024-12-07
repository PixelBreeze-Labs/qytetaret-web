'use client';
import "../../styles/globals.css";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import { HeaderWrapper } from "@/components/Header/HeaderWrapper";
import { FooterWrapper } from "@/components/Footer/FooterWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useTranslations } from 'next-intl';

export default function SiteLayout({
									   children,
								   }: {
	children: React.ReactNode;
}) {
	const t = useTranslations();

	return (
		<Providers>
			<NextTopLoader
				color='#FF0000'
				showSpinner={false}
				shadow='none'
			/>
			<HeaderWrapper />
			{children}
			<FooterWrapper />
		</Providers>
	);
}