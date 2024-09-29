import React, { useState } from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import { supabase } from "@/utils/supabase/supabaseClient"; // Adjust the import path as needed
import { useUser } from "@clerk/nextjs"; // Import the useUser hook from Clerk

function UpdatePatientMR({ patientID }) {
	const [form] = Form.useForm();
	const { user } = useUser();

	const handleSubmit = async (values, tableName) => {
		if (!patientID) {
			message.error("Patient ID not found. Please try again later.");
			return;
		}

		try {
			const { error } = await supabase
				.from(tableName)
				.insert({ ...values, patientID });

			if (error) throw error;

			message.success(`Patient ${tableName} updated successfully!`);
			form.resetFields();
		} catch (error) {
			console.error(`Error updating patient ${tableName}:`, error);
			message.error(
				`Failed to update patient ${tableName}. Please try again.`
			);
		}
	};

	return (
		<>
			<div className=" grid grid-cols-2 justify-start gap-4 items-start">
				<Form
					form={form}
					onFinish={(values) =>
						handleSubmit(values.medicalHistory, "MedicalHistory")
					}
					layout="vertical"
					className="max-w-md my-8 p-6 mx-4 bg-white rounded-lg shadow-md"
				>
					<div className="section medical-history">
						<h2 className="text-2xl font-bold">Medical History</h2>
						<Form.Item
							name={["medicalHistory", "condition"]}
							label="Condition"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name={["medicalHistory", "diagnosisDate"]}
							label="Diagnosis Date"
							rules={[{ required: true }]}
						>
							<DatePicker />
						</Form.Item>
						<Form.Item
							name={["medicalHistory", "treatmentID"]}
							label="Treatment ID"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save Medical History
							</Button>
						</Form.Item>
					</div>
				</Form>

				<Form
					form={form}
					onFinish={(values) =>
						handleSubmit(
							values.pastHospitalization,
							"PastHospitalization"
						)
					}
					layout="vertical"
					className="max-w-md my-8 p-6 mx-4 bg-white rounded-lg shadow-md"
				>
					<div className="section past-hospitalization">
						<h2 className="text-2xl font-bold">
							Past Hospitalization
						</h2>
						<Form.Item
							name={["pastHospitalization", "hospital"]}
							label="Hospital"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name={[
								"pastHospitalization",
								"hospitalizationDate",
							]}
							label="Hospitalization Date"
							rules={[{ required: true }]}
						>
							<DatePicker />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save Past Hospitalization
							</Button>
						</Form.Item>
					</div>
				</Form>

				<Form
					form={form}
					onFinish={(values) =>
						handleSubmit(values.pastSurgery, "PastSurgery")
					}
					layout="vertical"
					className="max-w-md my-8 p-6 mx-4 bg-white rounded-lg shadow-md"
				>
					<div className="section past-surgery">
						<h2 className="text-2xl font-bold">Past Surgery</h2>
						<Form.Item
							name={["pastSurgery", "surgeryID"]}
							label="Surgery ID"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name={["pastSurgery", "surgeryDate"]}
							label="Surgery Date"
							rules={[{ required: true }]}
						>
							<DatePicker />
						</Form.Item>
						<Form.Item
							name={["pastSurgery", "institution"]}
							label="Institution"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save Past Surgery
							</Button>
						</Form.Item>
					</div>
				</Form>

				<Form
					form={form}
					onFinish={(values) =>
						handleSubmit(
							values.patientImmunizations,
							"PatientImmunizations"
						)
					}
					layout="vertical"
					className="max-w-md my-8 p-6 mx-4 bg-white rounded-lg shadow-md"
				>
					<div className="section patient-immunizations">
						<h2 className="text-2xl font-bold">
							Patient Immunizations
						</h2>
						<Form.Item
							name={["patientImmunizations", "surgeryID"]}
							label="Surgery ID"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name={["patientImmunizations", "surgeryDate"]}
							label="Surgery Date"
							rules={[{ required: true }]}
						>
							<DatePicker />
						</Form.Item>
						<Form.Item
							name={["patientImmunizations", "institution"]}
							label="Institution"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Save Patient Immunizations
							</Button>
						</Form.Item>
					</div>
				</Form>
			</div>
		</>
	);
}

export default UpdatePatientMR;
