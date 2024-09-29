import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Spin, Alert, Collapse } from "antd";
import { supabase } from "@/utils/supabase/supabaseClient";
import Link from "next/link";

const { Panel } = Collapse;

const PopulatePrescriptions = () => {
	const { user } = useUser();
	const [prescriptions, setPrescriptions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fdaData, setFdaData] = useState({});

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
						"prescriptionID, dose, frequency, drugName, drugClass, drugName, drugClass, duration"
					)
					.eq("patientID", patientData.patientID);

			if (prescriptionError) throw prescriptionError;

			setPrescriptions(prescriptionData);

			// After fetching prescriptions, fetch FDA data for each
			const fdaDataPromises = prescriptionData.map(fetchFdaData);
			const fdaResults = await Promise.all(fdaDataPromises);
			const fdaDataMap = Object.fromEntries(fdaResults);
			setFdaData(fdaDataMap);
		} catch (err) {
			console.error("Error fetching prescriptions:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchFdaData = async (prescription) => {
		try {
			const response = await fetch(`https://api.fda.gov/drug/label.json/?search=${encodeURIComponent(prescription.drugName)}`);
			const data = await response.json();
			const result = data.results[0] || {};
			return [prescription.prescriptionID, extractRelevantData(result)];
		} catch (error) {
			console.error(`Error fetching FDA data for ${prescription.drugName}:`, error);
			return [prescription.prescriptionID, {}];
		}
	};

	const extractRelevantData = (data) => {
		const relevantKeys = [
			'package_ndc', 'brand_name', 'generic_name', 'purpose',
			'indications_and_usage', 'warnings', 'do_not_use',
			'ask_a_doctor', 'ask_doctor_or_pharmacist', 'stop_use',
			'pregnancy_or_breast_feeding', 'keep_out_of_reach_of_children',
			'dosage_and_administration', 'storage_and_handling',
			'package_label_principal_display_panel'
		];
		return Object.fromEntries(
			relevantKeys.map(key => [key, data[key] ? data[key][0] : 'Not available'])
		);
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
						<li key={index} style={{
							marginBottom: "20px",
							borderBottom: "1px solid #eee",
							paddingBottom: "10px",
							cursor: "pointer",
						}}>
							<Link
								href={`/prescription/${prescription.prescriptionID}`}
								passHref
							>
								<div style={{ cursor: "pointer" }}>
									<p>
										<strong>Drug Name:</strong>{" "}
										{prescription.drugName}
									</p>
									<p>
										<strong>Drug Class:</strong>{" "}
										{prescription.drugClass}
									</p>
									<p>
										<strong>Dose:</strong> {prescription.dose}{" "}
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
								</div>
							</Link>
							<Collapse>
								<Panel header="FDA Information" key="1">
									{fdaData[prescription.prescriptionID] ? (
										Object.entries(fdaData[prescription.prescriptionID]).map(([key, value]) => (
											<p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
										))
									) : (
										<p>FDA data not available</p>
									)}
								</Panel>
							</Collapse>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PopulatePrescriptions;
