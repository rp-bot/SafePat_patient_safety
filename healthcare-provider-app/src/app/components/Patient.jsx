import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import Link from "next/link";

export const Patient = () => {
	const [patients, setPatients] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPatients();
	}, []);

	const fetchPatients = async () => {
		try {
			const { data, error } = await supabase.from("Patient").select("*");

			if (error) throw error;
			setPatients(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching patients:", error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading patients...</div>;

	return (
		<div className="flex flex-col gap-4 ">
			<h1 className="text-2xl font-bold">Patients</h1>
			{patients.length === 0 ? (
				<p>No patients found.</p>
			) : (
				<ul className="flex flex-col gap-4 mx-4  ">
					{patients.map((patient) => (
						<Link
							href={`/patient/${patient.patientID}`}
							key={patient.patientID}
							className="grid grid-cols-2 bg-zinc-200  p-4 rounded-lg"
						>
							<h2>
								{patient.lastName}, {patient.firstName}
							</h2>
							<p className="text-right">
								Age: {calculateAge(patient.dob)}
							</p>
							{/* <p>Email: {patient.email}</p> */}
							{/* Add more patient details as needed */}
						</Link>
					))}
				</ul>
			)}
		</div>
	);
};
const calculateAge = (dob) => {
	const today = new Date();
	const birthDate = new Date(dob);
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
