// app/components/Navbar.js

"use client";

import { useState } from "react";
import Link from "next/link";
import {
	UserButton,
	SignedIn,
	SignedOut,
	SignInButton,
} from "@clerk/clerk-react";
import SaveUserInfo from "./SaveUserInfo";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white text-2xl font-bold">
					<Link href="/">SafePat Doctor</Link>
				</div>
				<div className="hidden md:flex space-x-4">
					{/* Show UserButton if signed in */}
					<SignedIn>
						<SaveUserInfo />
						<UserButton />
					</SignedIn>
					{/* Show SignIn button if signed out */}
					<SignedOut>
						<SignInButton />
					</SignedOut>
				</div>
				<button
					className="md:hidden text-white"
					onClick={() => setIsOpen(!isOpen)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d={
								isOpen
									? "M6 18L18 6M6 6l12 12"
									: "M4 6h16M4 12h16m-7 6h7"
							}
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden">
					<div className="space-y-2 px-2 pt-2 pb-3">
						<Link
							href="/"
							className="block text-white hover:text-gray-400"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="block text-white hover:text-gray-400"
						>
							About
						</Link>
						<Link
							href="/services"
							className="block text-white hover:text-gray-400"
						>
							Services
						</Link>
						<Link
							href="/contact"
							className="block text-white hover:text-gray-400"
						>
							Contact
						</Link>
						{/* Mobile menu UserButton */}
						<SignedIn>
							<UserButton afterSignOutUrl="/" />
						</SignedIn>
						<SignedOut>
							<Link
								href="/sign-in"
								className="block text-white hover:text-gray-400"
							>
								Sign In
							</Link>
						</SignedOut>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
