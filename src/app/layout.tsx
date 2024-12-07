import { Inter } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: 'Qytetaret',
	description: 'Community reporting platform',
};

export default async function RootLayout({
											 children
										 }: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
		<head>
			<meta name="application-name" content="Qytetaret" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			<meta name="apple-mobile-web-app-title" content="Qytetaret" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="theme-color" content="#FF0000" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="shortcut icon" href="/images/img.png" />
		</head>
		<body
			suppressHydrationWarning
			className={`${inter.className} flex min-h-screen flex-col dark:bg-dark`}
		>
		<main className="pt-20">
			<NextIntlClientProvider messages={messages}>
				{children}
			</NextIntlClientProvider>
		</main>
		</body>
		</html>
	);
};
