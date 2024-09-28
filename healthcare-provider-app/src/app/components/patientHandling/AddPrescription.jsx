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

	const onFinish = async (values) => {
		try {
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
		<div className="max-w-md mt-8 p-6 bg-white rounded-lg shadow-md">
			<Title level={2} className="text-center mb-6">
				Add New Prescription
			</Title>
			<Form form={form} onFinish={onFinish} layout="vertical">
				{/* <Form.Item label="Patient">
					<Input
						value={`${patientName} (ID: ${patientID})`}
						disabled
					/>
				</Form.Item>
				<Form.Item label="Doctor">
					<Input value={doctorName} disabled />
				</Form.Item> */}
				<Form.Item
					name="drugName"
					label="Drug Name"
					rules={[
						{
							required: true,
							message: "Please input the drug name!",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="drugClass"
					label="Drug Class"
					rules={[
						{
							required: true,
							message: "Please input the drug class!",
						},
					]}
				>
					<Input />
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
				>
					<DatePicker className="w-full" />
				</Form.Item>
				<Form.Item
					name="duration"
					label="Duration"
					rules={[
						{
							required: true,
							message: "Please input the duration!",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="frequency"
					label="Frequency"
					rules={[
						{
							required: true,
							message: "Please input the frequency!",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="doseUnit"
					label="Dose Unit"
					rules={[
						{
							required: true,
							message: "Please select the dose unit!",
						},
					]}
				>
					<Select>
						<Option value="mg">mg</Option>
						<Option value="mcg">mcg</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="dose"
					label="Dose"
					rules={[
						{ required: true, message: "Please input the dose!" },
					]}
				>
					<InputNumber className="w-full" />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Add Prescription
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
