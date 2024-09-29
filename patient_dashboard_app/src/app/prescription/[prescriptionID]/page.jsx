"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabase/supabaseClient";
import Calendar from "@/app/components/Calendar";
// import Calendar from "@/app/components/Calendar";

export default function PrescriptionDetails() {
	const [prescription, setPrescription] = useState(null);
	const [doctorName, setDoctorName] = useState("");
	const [loading, setLoading] = useState(true);
	const { isLoaded, isSignedIn, user } = useUser();
	const { prescriptionID } = useParams();

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			fetchPrescriptionDetails();
		} else if (isLoaded) {
			setLoading(false);
		}
	}, [isLoaded, isSignedIn, prescriptionID]);

	const fetchPrescriptionDetails = async () => {
		try {
			const { data: prescriptionData, error: prescriptionError } =
				await supabase
					.from("Prescription")
					.select("*")
					.eq("prescriptionID", prescriptionID)
					.single();

			if (prescriptionError) throw prescriptionError;
			setPrescription(prescriptionData);

			const { data: doctorData, error: doctorError } = await supabase
				.from("DoctorClerk")
				.select("first_name, last_name")
				.eq("doctorID", prescriptionData.doctorID)
				.single();

			if (doctorError) throw doctorError;
			setDoctorName(`${doctorData.first_name} ${doctorData.last_name}`);
		} catch (error) {
			console.error(
				"Error fetching prescription or doctor details:",
				error.message
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isLoaded || loading) return <div>Loading...</div>;
	if (!isSignedIn)
		return <div>Please sign in to view prescription details.</div>;
	if (!prescription) return <div>Prescription not found</div>;

	return (
		<div className="p-4">
			<h1 className="text-4xl font-bold mb-4 w-full flex justify-center">
				{prescription.drugName}
			</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<p>
					<strong>Doctor:</strong> {doctorName}
				</p>

				<p>
					<strong>Drug Class:</strong> {prescription.drugClass}
				</p>
				<p>
					<strong>Dose:</strong> {prescription.dose}{" "}
					{prescription.doseUnit}
				</p>
				<p>
					<strong>Frequency:</strong> {prescription.frequency}
				</p>
				<p>
					<strong>Duration:</strong> {prescription.duration}
				</p>
				<p>
					<strong>Prescribed Date:</strong>{" "}
					{new Date(prescription.startDate).toLocaleDateString()}
				</p>
				<p>
					<strong>Prescribed Date:</strong> {prescriptionID}
				</p>
				<p>
					<strong>Notes:</strong>{" "}
					{prescription.notes || "No notes available"}
				</p>
			</div>
			<Calendar prescriptionID={prescriptionID} />
		</div>
	);
}
