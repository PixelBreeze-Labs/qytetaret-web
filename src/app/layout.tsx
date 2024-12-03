import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: 'Qytetaret',
	description: 'Community reporting platform',
};

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en' suppressHydrationWarning={true}>
		<head>
			<meta name="application-name" content="Qytetaret" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			<meta name="apple-mobile-web-app-title" content="Qytetaret" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="theme-color" content="#FF0000" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="shortcut icon" href="/favicon.ico" />
		</head>
		<body
			className={`${inter.className} flex min-h-screen flex-col dark:bg-[#151F34]`}
		>
		<div className="pt-20"> {/* Add padding top */}
			{children}
		</div>
		</body>
		</html>
	);
};

export default layout;