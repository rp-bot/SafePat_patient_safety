import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Spin, Alert } from "antd";
import { supabase } from "@/utils/supabase/supabaseClient";

const PopulatePrescriptions = () => {
	const { user } = useUser();
	const [prescriptions, setPrescriptions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (user) {
			fetchPrescriptions();
		}
	}, [user]);

	const fetchPrescriptions = async () => {
		try {
			// First, get the patientID using the Clerk username
			const { data: patientData, error: patientError } = await supabase
				.from("Patient")
				.select("patientID")
				.eq("clerk_username", user.username)
				.single();

			if (patientError) throw patientError;

			if (!patientData) {
				throw new Error("Patient not found");
			}

			// Now, fetch prescriptions for this patient
			const { data: prescriptionData, error: prescriptionError } =
				await supabase
					.from("Prescription")
					.select(
						"Dose, frequency, drugName, drugClass, drugName, drugClass, duration"
					)
					.eq("patientID", patientData.patientID);

			if (prescriptionError) throw prescriptionError;

			setPrescriptions(prescriptionData);
		} catch (err) {
			console.error("Error fetching prescriptions:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Spin size="large" />;
	}

	if (error) {
		return (
			<Alert message="Error" description={error} type="error" showIcon />
		);
	}

	return (
		<div>
			<h2>Your Prescriptions</h2>
			{prescriptions.length === 0 ? (
				<p>No prescriptions found.</p>
			) : (
				<ul style={{ listStyleType: "none", padding: 0 }}>
					{prescriptions.map((prescription, index) => (
						<li
							key={index}
							style={{
								marginBottom: "20px",
								borderBottom: "1px solid #eee",
								paddingBottom: "10px",
							}}
						>
							<p>
								<strong>Drug Name:</strong>{" "}
								{prescription.drugName}
							</p>
							<p>
								<strong>Drug Class:</strong>{" "}
								{prescription.drugClass}
							</p>
							<p>
								<strong>Dose:</strong> {prescription.Dose}{" "}
								{prescription.doseUnit}
							</p>
							<p>
								<strong>Frequency:</strong>{" "}
								{prescription.frequency}
							</p>
							<p>
								<strong>Duration:</strong>{" "}
								{prescription.duration}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PopulatePrescriptions;
