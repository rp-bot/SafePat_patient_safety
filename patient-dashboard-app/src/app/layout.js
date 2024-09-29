import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Head from "next/head";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "SafePat",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<Head>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<body>
					<Navbar />

					<main>{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
