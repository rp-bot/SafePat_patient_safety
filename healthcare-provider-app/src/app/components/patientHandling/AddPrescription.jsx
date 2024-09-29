import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
	Form,
	Input,
	DatePicker,
	Select,
	InputNumber,
	Button,
	Typography,
	message,
	Modal,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

export const AddPrescription = ({ patientID }) => {
	const [form] = Form.useForm();
	const [patientName, setPatientName] = useState("");
	const [doctorName, setDoctorName] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("Fetching data for patientID:", patientID);

				// Fetch doctor ID and name
				const { data: relationshipData, error: relationshipError } =
					await supabase
						.from("ProviderRelationship")
						.select("doctorID")
						.eq("patientID", patientID)
						.single();

				if (relationshipError) throw relationshipError;

				console.log("ProviderRelationship data:", relationshipData);

				if (relationshipData) {
					// Fetch doctor name
					const { data: doctorData, error: doctorError } =
						await supabase
							.from("DoctorClerk")
							.select("first_name, last_name")
							.eq("doctorID", relationshipData.doctorID)
							.single();

					if (doctorError) throw doctorError;

					console.log("Doctor data:", doctorData);

					if (doctorData) {
						setDoctorName(
							`${doctorData.first_name} ${doctorData.last_name}`
						);
					}
				}

				// Fetch patient name
				const { data: patientData, error: patientError } =
					await supabase
						.from("Patient")
						.select("firstName, lastName")
						.eq("patientID", patientID)
						.single();

				if (patientError) throw patientError;

				console.log("Patient data:", patientData);

				if (patientData) {
					setPatientName(
						`${patientData.firstName} ${patientData.lastName}`
					);
				}
			} catch (error) {
				console.error("Error fetching data:", error.message);
				message.error("Failed to fetch patient and doctor data");
			}
		};

		if (patientID) {
			fetchData();
		}
	}, [patientID]);

	const checkExistingPrescriptions = async (newDrugClass) => {
		try {
			const { data: prescriptions, error: prescriptionError } = await supabase
				.from("Prescription")
				.select("drugName, drugClass, startDate, duration, frequency, dose, doseUnit")
				.eq("patientID", patientID)
				.eq("drugClass", newDrugClass);

			if (prescriptionError) throw prescriptionError;

			if (prescriptions && prescriptions.length > 0) {
				const existingPrescription = prescriptions[0];
				
				return new Promise((resolve) => {
					Modal.confirm({
						title: "Existing Prescription of Same Class Found",
						content: `Another doctor has already prescribed a medication of class "${existingPrescription.drugClass}" on ${existingPrescription.startDate}. 
						The prescription was prescribed for a duration of: ${existingPrescription.duration} days, 
						a frequency of ${existingPrescription.frequency} times a day, with a dose of ${existingPrescription.dose} ${existingPrescription.doseUnit}.
						Do you want to proceed with adding this new prescription?`,
						onOk: () => resolve(true),
						onCancel: () => resolve(false),
					});
				});
			}
			return true;
		} catch (error) {
			console.error("Error checking existing prescriptions:", error.message);
			message.error("Failed to check existing prescriptions. Please try again.");
			return false;
		}
	};

	const onFinish = async (values) => {
		try {
			const shouldProceed = await checkExistingPrescriptions(values.drugClass);
			if (!shouldProceed) return;

			const prescriptionData = {
				...values,
				patientID,
				startDate: values.startDate.format("YYYY-MM-DD"),
			};

			const { data, error } = await supabase
				.from("Prescription")
				.insert([prescriptionData]);

			if (error) throw error;

			message.success("Prescription added successfully!");
			form.resetFields();
		} catch (error) {
			console.error("Error adding prescription:", error.message);
			message.error("Failed to add prescription. Please try again.");
		}
	};

	return (
		<div className="max-w-md mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-start">
			<h1 className="text-center mb-6 font-bold text-2xl">
				Add New Prescription
			</h1>
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Form.Item
					label="Drug Details"
					required
					style={{ marginBottom: 8 }} // Adjust vertical distance
				>
					<Input.Group compact>
						<Form.Item
							name="drugName"
							noStyle
							rules={[
								{
									required: true,
									message: "Please input the drug name!",
								},
							]}
						>
							<Input placeholder="Drug Name" className="w-1/2" />
						</Form.Item>
						<Form.Item
							name="drugClass"
							noStyle
							rules={[
								{
									required: true,
									message: "Please input the drug class!",
								},
							]}
						>
							<Input placeholder="Drug Class" className="w-1/2" />
						</Form.Item>
					</Input.Group>
				</Form.Item>
				<Form.Item
					name="startDate"
					label="Start Date"
					rules={[
						{
							required: true,
							message: "Please select the start date!",
						},
					]}
					style={{ marginBottom: 8 }} // Adjust vertical distance
				>
					<DatePicker className="w-full" />
				</Form.Item>
				<Form.Item
					label="Duration and Frequency"
					required
					style={{ marginBottom: 8 }} // Adjust vertical distance
				>
					<Input.Group compact>
						<Form.Item
							name="duration"
							noStyle
							rules={[
								{
									required: true,
									message: "Please input the duration!",
								},
							]}
						>
							<InputNumber
								placeholder="Duration"
								className="w-1/2"
							/>
						</Form.Item>
						<Form.Item
							name="frequency"
							noStyle
							rules={[
								{
									required: true,
									message: "Please input the frequency!",
								},
							]}
						>
							<InputNumber
								placeholder="Frequency"
								className="w-1/2"
							/>
						</Form.Item>
					</Input.Group>
				</Form.Item>
				<Form.Item
					label="Dose"
					required
					style={{ marginBottom: 8 }} // Adjust vertical distance
				>
					<Input.Group compact>
						<Form.Item
							name="dose"
							noStyle
							rules={[
								{
									required: true,
									message: "Please input the dose!",
								},
							]}
						>
							<InputNumber className="w-2/3" />
						</Form.Item>
						<Form.Item
							name="doseUnit"
							noStyle
							rules={[
								{
									required: true,
									message: "Please select the dose unit!",
								},
							]}
						>
							<Select className="w-1/3">
								<Option value="mg">mg</Option>
								<Option value="mcg">mcg</Option>
							</Select>
						</Form.Item>
					</Input.Group>
				</Form.Item>
				<Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
					{" "}
					{/* Adjust vertical distance */}
					<Button type="primary" htmlType="submit" className="w-full">
						Add Prescription
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
