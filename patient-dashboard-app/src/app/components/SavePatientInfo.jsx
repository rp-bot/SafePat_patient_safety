import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabase/supabaseClient";
export default function SavePatientInfo() {
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
			const name = `${user?.firstName} ${user?.lastName}`;
			const email = user.primaryEmailAddress?.emailAddress;
            // console.log(clerkUserId);
			try {
				// Insert or update user information into the Supabase 'users' table
				const { data, error } = await supabase
					.from("PatientClerk")
					.upsert(
						{
							clerk_user_id: clerkUserId,
							name: name,
							email: email,
							// healthcareProvider: "TRUE",
						},
						{
							// Update the row if 'clerk_user_id' already exists
							onConflict: ["clerk_user_id"],
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

	return (
        <div className="">
            hello
            {user?.username}
        </div>
    );
}
