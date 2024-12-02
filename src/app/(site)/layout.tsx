import "../../styles/globals.css";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";
import { HeaderWrapper } from "@/components/Header/HeaderWrapper";
import { FooterWrapper } from "@/components/Footer/FooterWrapper";

export default function RootLayout({
									   children,
								   }: {
	children: React.ReactNode;
}) {
	return (
		<>
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
		</>
	);
}