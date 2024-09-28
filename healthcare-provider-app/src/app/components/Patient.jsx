import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

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

	const calculateAge = (dob) => {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}

		return age;
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold my-5">Your Patients</h2>
			{patients.map((patient) => (
				<Link
					href={`/patient/${patient.patientID}`}
					key={patient.patientID}
					className="mx-4 bg-zinc-800 p-4 rounded-md grid grid-cols-2 text-zinc-50 cursor-pointer"
				>
					<h3 className="text-xl font-bold">
						{patient.firstName + " " + patient.lastName}
					</h3>
					<p>Age: {calculateAge(patient.dob)}</p>
					<p>Gender: {patient.gender}</p>
					<p>Email Address: {patient.email}</p>
					{/* Add more patient information as needed */}
				</Link>
			))}
		</div>
	);
}
