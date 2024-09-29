import React, { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import PrescriptionItem from "./PrescriptionItem"; // Import the new component
import { supabase } from "@/utils/supabase/supabaseClient";

const PopulatePrescriptions = () => {
	const { user } = useUser();
	const [prescriptions, setPrescriptions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fdaData, setFdaData] = useState({});

	useEffect(() => {
		if (user) {
			fetchPatientIDAndPrescriptions();
		}
	}, [user]);

	const fetchPatientIDAndPrescriptions = async () => {
		try {
			// Fetch patientID using clerk.username
			const { data: patientData, error: patientError } = await supabase
				.from("Patient")
				.select("patientID")
				.eq("clerk_username", user.username)
				.single();

			if (patientError) {
				throw new Error(patientError.message);
			}

			const patientID = patientData.patientID;

			// Fetch prescriptions using patientID
			const { data: prescriptionData, error: prescriptionError } =
				await supabase
					.from("Prescription")
					.select("*")
					.eq("patientID", patientID);

			if (prescriptionError) {
				throw new Error(prescriptionError.message);
			}

			setPrescriptions(prescriptionData);

			// After fetching prescriptions, fetch FDA data for each
			const fdaDataPromises = prescriptionData.map(fetchFdaData);
			const fdaResults = await Promise.all(fdaDataPromises);
			const fdaDataMap = Object.fromEntries(fdaResults);
			setFdaData(fdaDataMap);
		} catch (err) {
			console.error("Error fetching patientID or prescriptions:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchFdaData = async (prescription) => {
		try {
			const response = await fetch(
				`https://api.fda.gov/drug/label.json/?search=${encodeURIComponent(
					prescription.drugName
				)}`
			);
			const data = await response.json();
			const result = data.results[0] || {};
			return [prescription.prescriptionID, extractRelevantData(result)];
		} catch (error) {
			console.error(
				`Error fetching FDA data for ${prescription.drugName}:`,
				error
			);
			return [prescription.prescriptionID, {}];
		}
	};

	const extractRelevantData = (data) => {
		const relevantKeys = [
			"package_ndc",
			"brand_name",
			"generic_name",
			"purpose",
			"indications_and_usage",
			"warnings",
			"do_not_use",
			"ask_a_doctor",
			"ask_doctor_or_pharmacist",
			"stop_use",
			"pregnancy_or_breast_feeding",
			"keep_out_of_reach_of_children",
			"dosage_and_administration",
			"storage_and_handling",
			"package_label_principal_display_panel",
		];
		return Object.fromEntries(
			relevantKeys.map((key) => [
				key,
				data[key] ? data[key][0] : "Not available",
			])
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
		<div className="bg-zinc-300 p-2 rounded-lg">
			<h2 className="text-2xl font-bold my-2 w-full self-center flex justify-center ">
				My Prescriptions
			</h2>
			{prescriptions.length === 0 ? (
				<p>No prescriptions found.</p>
			) : (
				<ul style={{ listStyleType: "none", padding: 0 }}>
					{prescriptions.map((prescription, index) => (
						<PrescriptionItem
							key={index}
							prescription={prescription}
							fdaData={fdaData}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default PopulatePrescriptions;
