// components/UserInfo.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabase/supabaseClient";
export default function SaveUserInfo() {
	const { isSignedIn, user } = useUser();
	const [status, setStatus] = useState("");

	useEffect(() => {
		const saveUserToSupabase = async () => {
			if (!isSignedIn || !user) {
				setStatus("Not signed in");
				return;
			}

			// Gather user information from Clerk
			const clerkUserId = user?.username;
			const firstName = user?.firstName;
			const lastName = user?.lastName;
			const email = user.primaryEmailAddress?.emailAddress;
			const phone = user?.phone_number;
			try {
				// Insert or update user information into the Supabase 'users' table
				const { data, error } = await supabase
					.from("DoctorClerk")
					.upsert(
						{
							clerk_username: clerkUserId,
							first_name: firstName,
							last_name: lastName,
							email: email,
							phone: phone,
							// healthcareProvider: "TRUE",
						},
						{
							// Update the row if 'clerk_user_id' already exists
							onConflict: ["clerk_username"],
						}
					);

				if (error) {
					console.error("Supabase error:", error);
					throw error;
				}

				setStatus("User information saved successfully");
				console.log("User data:", data);
			} catch (err) {
				setStatus(`Failed to save user information: ${err.message}`);
			}
		};

		// Call the function to save user info
		saveUserToSupabase();
	}, [isSignedIn, user]);

	return;
	<div>
		<p>{console.log(user)}</p>
	</div>;
}
