"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { AddPrescription } from "@/app/components/patientHandling/AddPrescription";

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
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Patient Details</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<p>patiendID: {patientID}</p>
				<p>
					<strong>Name:</strong> {patient.firstName}{" "}
					{patient.lastName}
				</p>
				<p>
					<strong>Date of Birth:</strong> {patient.dob}
				</p>
				<p>
					<strong>Email:</strong> {patient.email}
				</p>
				{/* Add more patient details as needed */}
			</div>
			<AddPrescription patientID={patientID} />
		</div>
	);
}
