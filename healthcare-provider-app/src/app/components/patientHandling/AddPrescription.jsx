import React, { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
export const AddPrescription = ({ patientID }) => {
	const [prescription, setPrescription] = useState({
		patient_id: patientID || "",
		doctor_id: "",
		medication: "",
		dosage: "",
		prescription_date: "",
	});
	console.log(prescription);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setPrescription({ ...prescription, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase
				.from("Prescription")
				.insert([prescription]);

			if (error) throw error;

			alert("Prescription added successfully!");
			// Reset form after successful submission
			setPrescription({
				patient_id: "",
				doctor_id: "",
				medication: "",
				dosage: "",
				prescription_date: "",
			});
		} catch (error) {
			console.error("Error adding prescription:", error.message);
			alert("Failed to add prescription. Please try again.");
		}
	};

	return (
		<div className="max-w-md  mt-8 p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
				Add New Prescription
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex flex-col">
					<label
						htmlFor="patient_id"
						className="mb-1 font-medium text-gray-700"
					>
						Patient ID:
					</label>
					<input
						type="number"
						id="patient_id"
						name="patient_id"
						value={patientID}
						placeholder={patientID}
						onChange={handleChange}
						required
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="doctor_id"
						className="mb-1 font-medium text-gray-700"
					>
						Doctor ID:
					</label>
					<input
						type="number"
						id="doctor_id"
						name="doctor_id"
						value={prescription.doctor_id}
						onChange={handleChange}
						required
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="medication"
						className="mb-1 font-medium text-gray-700"
					>
						Medication:
					</label>
					<input
						type="text"
						id="medication"
						name="medication"
						value={prescription.medication}
						onChange={handleChange}
						required
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="dosage"
						className="mb-1 font-medium text-gray-700"
					>
						Dosage:
					</label>
					<input
						type="text"
						id="dosage"
						name="dosage"
						value={prescription.dosage}
						onChange={handleChange}
						required
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col">
					<label
						htmlFor="prescription_date"
						className="mb-1 font-medium text-gray-700"
					>
						Prescription Date:
					</label>
					<input
						type="datetime-local"
						id="prescription_date"
						name="prescription_date"
						value={prescription.prescription_date}
						onChange={handleChange}
						required
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-300"
				>
					Add Prescription
				</button>
			</form>
		</div>
	);
};
