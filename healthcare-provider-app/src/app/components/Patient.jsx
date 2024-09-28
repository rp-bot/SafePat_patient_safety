import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useUser } from "@clerk/nextjs";

export function Patient() {
	const [patients, setPatients] = useState([]);
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			fetchPatients();
		}
	}, [user]);

	const fetchPatients = async () => {
		try {
			// Get the current user's username
			const username = user.username;

			// First, get the doctorID from the DoctorClerk table
			const { data: doctorData, error: doctorError } = await supabase
				.from("DoctorClerk")
				.select("doctorID")
				.eq("clerk_username", username)
				.single();

			if (doctorError) throw doctorError;

			const doctorID = doctorData.doctorID;
			// console.log(doctorID);
			// Now, get all patientIDs associated with the doctorID
			const { data: relationships, error: relationshipError } =
				await supabase
					.from("ProviderRelationship")
					.select("patientID")
					.eq("doctorID", doctorID);

			if (relationshipError) throw relationshipError;

			// Extract patientIDs from the relationships
			const patientIDs = relationships.map((rel) => rel.patientID);
			console.log(patientIDs);
			// Finally, fetch patient information for these patientIDs
			const { data: patientData, error: patientError } = await supabase
				.from("Patient")
				.select("*")
				.in("patientID", patientIDs);

			if (patientError) throw patientError;

			setPatients(patientData);
		} catch (error) {
			console.error("Error fetching patients:", error.message);
		}
	};

	return (
		<div>
			<h2>Your Patients</h2>
			{patients.map((patient) => (
				<div key={patient.patientID}>
					<h3>{patient.firstName + " " + patient.lastName}</h3>
					<p>Date of Birth: {patient.dob}</p>
					<p>Gender: {patient.gender}</p>
					<p>Email Address: {patient.email}</p>
					{/* Add more patient information as needed */}
				</div>
			))}
		</div>
	);
}
