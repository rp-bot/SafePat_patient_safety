"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { AddPrescription } from "@/app/components/patientHandling/AddPrescription";
import UpdatePatientMR from "@/app/components/patientHandling/UpdatePatientMR";

export default function PatientDetails() {
	const [patient, setPatient] = useState(null);
	const [loading, setLoading] = useState(true);
	const { patientID } = useParams();

	useEffect(() => {
		fetchPatientDetails();
	}, [patientID]);

	const fetchPatientDetails = async () => {
		try {
			const { data, error } = await supabase
				.from("Patient")
				.select("*")
				.eq("patientID", patientID)
				.single();

			if (error) throw error;
			setPatient(data);
		} catch (error) {
			console.error("Error fetching patient details:", error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading patient details...</div>;
	if (!patient) return <div>Patient not found</div>;

	return (
		<div className="p-4 bg-zinc-100">
			<div className="p-10 mx-auto bg-white rounded-lg shadow-md">
				{/* <p>patiendID: {patientID}</p> */}
				<p className="text-xl font-bold">
					{patient.firstName} {patient.lastName}
				</p>
				<p>
					<strong>Date of Birth:</strong> {patient.dob}
				</p>
				<p>
					<strong>Email:</strong> {patient.email}
				</p>
				{/* Add more patient details as needed */}
			</div>
			<div className="flex flex-row justify-between gap-4 w-full">
				<AddPrescription patientID={patientID} />
				<UpdatePatientMR patientID={patientID} />
			</div>
		</div>
	);
}
