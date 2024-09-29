"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Alert, message } from "antd";
import CheckPatientData from "./components/CheckPatientData";
import PopulatePrescriptions from "./components/PopulatePrescriptions";
import Calendar from "./components/Calendar";

export default function Page() {
	const { user } = useUser();
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		if (user) {
			checkPatientVisited();
		}
	}, [user]);

	const checkPatientVisited = async () => {
		try {
			const { data, error } = await supabase
				.from('Patient')
				.select('visited')
				.eq('clerk_username', user.username)
				.single();

			if (error) throw error;

			if (data && data.visited) {
				setShowAlert(true);
			}
		} catch (error) {
			console.error('Error checking patient visited status:', error);
		}
	};

	const handleAlertClose = async () => {
		try {
			const { error } = await supabase
				.from('Patient')
				.update({ visited: false })
				.eq('clerk_username', user.username);

			if (error) throw error;

			setShowAlert(false);
			message.success('Visit status updated successfully');
		} catch (error) {
			console.error('Error updating patient visited status:', error);
			message.error('Failed to update visit status');
		}
	};

	return (
		<div className="mx-48 my-20">
			<SignedIn>
				{showAlert && (
					<Alert
						message="Hospital Visit Alert"
						description="Please call your doctor to update them about your recent hospital visit."
						type="warning"
						showIcon
						closable
						onClose={handleAlertClose}
						style={{ marginBottom: 16 }}
					/>
				)}
				<CheckPatientData />
				<PopulatePrescriptions />
				<Calendar />
			</SignedIn>
		</div>
	);
}
