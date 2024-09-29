import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { supabase } from "@/utils/supabase/supabaseClient";

const CheckPatientData = () => {
	const { user } = useUser();
	const [showForm, setShowForm] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		checkPatientData();
	}, [user]);

	const checkPatientData = async () => {
		if (user && user.username) {
			const { data, error } = await supabase
				.from("Patient")
				.select("dob")
				.eq("clerk_username", user.username)
				.single();
			console.log(user.username);
			if (error) {
				console.error("Error checking patient data:", error);
				return;
			}

			if (!data || data.dob === null) {
				setShowForm(true);
			}
		}
	};

	const onFinish = async (values) => {
		const { data, error } = await supabase
			.from("Patient")
			.update({
				dob: values.dob,
				gender: values.gender,
				contact: values.contact,
				insuranceID: values.insuranceID,
				geneticDisposition: values.geneticDisposition,
			})
			.eq("clerk_username", user.username);

		if (error) {
			console.error("Error updating patient data:", error);
			message.error("Failed to update patient data");
		} else {
			message.success("Patient data updated successfully");
			setShowForm(false);
		}
	};

	if (!showForm) {
		return null;
	}

	return (
		<Form form={form} onFinish={onFinish} layout="vertical">
			<Form.Item
				name="dob"
				label="Date of Birth"
				rules={[
					{
						required: true,
						message: "Please input your date of birth!",
					},
				]}
			>
				<DatePicker />
			</Form.Item>
			<Form.Item
				name="gender"
				label="Gender"
				rules={[
					{ required: true, message: "Please select your gender!" },
				]}
			>
				<Select>
					<Select.Option value="male">Male</Select.Option>
					<Select.Option value="female">Female</Select.Option>
					<Select.Option value="other">Other</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item
				name="contact"
				label="Contact"
				rules={[
					{
						required: true,
						message: "Please input your contact number!",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name="insuranceID"
				label="Insurance ID"
				rules={[
					{
						required: true,
						message: "Please input your insurance ID!",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item name="geneticDisposition" label="Genetic Disposition">
				<Input.TextArea />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default CheckPatientData;
