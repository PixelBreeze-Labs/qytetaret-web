"use client";
import { usePathname } from "next/navigation";
import Footer from ".";

export const FooterWrapper = () => {
	const pathname = usePathname();

	return (
		<>
			{!pathname.startsWith("/admin") && !pathname.startsWith("/user") && (
				<Footer />
			)}
		</>
	);
};

// export default FooterWrapper;
