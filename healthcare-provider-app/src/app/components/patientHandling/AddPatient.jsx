import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/utils/supabase/supabaseClient"; // Ensure this path is correct

function AddPatient() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const { user } = useUser();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSearchTerm("");
		setSearchResults([]);
	};

	const handleSearch = async (value) => {
		setSearchTerm(value);
		if (value.length > 0) {
			const { data, error } = await supabase
				.from("Patient")
				.select("patientID, clerk_username")
				.ilike("clerk_username", `%${value}%`)
				.limit(10);

			if (error) {
				console.error("Error searching patients:", error);
				message.error("Failed to search patients");
			} else {
				setSearchResults(data);
			}
		} else {
			setSearchResults([]);
		}
	};

	const handleSelectPatient = async (patientId) => {
		// First, find the doctorID from the DoctorClerk table
		const { data: doctorData, error: doctorError } = await supabase
			.from("DoctorClerk")
			.select("doctorID")
			.eq("clerk_username", user?.username)
			.single();
		if (doctorError) {
			console.error("Error finding doctor:", doctorError);
			message.error("Failed to find doctor information");
			return;
		}

		if (!doctorData) {
			message.error("Doctor not found");
			return;
		}

		// Now insert the relationship using the found doctorID
		const { data, error } = await supabase
			.from("ProviderRelationship")
			.insert([{ doctorID: doctorData.doctorID, patientID: patientId }]);

		if (error) {
			console.error("Error adding relationship:", error);
			message.error("Failed to add patient relationship");
		} else {
			message.success("Patient relationship added successfully");
			handleCancel();
		}
	};

	return (
		<div>
			<Button onClick={showModal}>Search Patient</Button>
			<Modal
				title="Search Patient"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Input.Search
					placeholder="Enter patient username"
					onSearch={handleSearch}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ marginBottom: 16 }}
				/>
				{searchResults.length > 0 ? (
					<ul>
						{searchResults.map((patient) => (
							<li
								key={patient.id}
								onClick={() =>
									handleSelectPatient(patient?.patientID)
								}
								style={{ cursor: "pointer" }}
							>
								{patient.clerk_username}
							</li>
						))}
					</ul>
				) : (
					searchTerm && <p>No patients found</p>
				)}
			</Modal>
		</div>
	);
}

export default AddPatient;
