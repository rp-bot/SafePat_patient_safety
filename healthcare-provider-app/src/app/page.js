"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

import SaveUserInfo from "./components/SaveUserInfo";
import { Patient } from "./components/Patient";
import { useRouter } from "next/router";
import AddPatient from "./components/patientHandling/AddPatient";
import { SignedIn } from "@clerk/nextjs";
import DrugClassChecker from "./components/DrugClassChecker";
import UpdatePatientMR from "./components/patientHandling/UpdatePatientMR";

export default function Home() {
	const [input, setInput] = useState("");
	const [data, setData] = useState([]);
	const [refreshPatients, setRefreshPatients] = useState(0);

	const handlePatientAdded = () => {
		// Increment refreshPatients to trigger a re-render of Patient component
		setRefreshPatients((prev) => prev + 1);
	};

	return (
		<div className="mx-48 my-20 ">
			<SignedIn>
				<div className="flex flex-row justify-center items-center">
					<AddPatient onPatientAdded={handlePatientAdded} />
				</div>
				<Patient key={refreshPatients} />
				{/* <DrugClassChecker /> */}
				{/* <Prescription /> */}
				{/* <Calendar /> */}
				
			</SignedIn>
		</div>
	);
}
