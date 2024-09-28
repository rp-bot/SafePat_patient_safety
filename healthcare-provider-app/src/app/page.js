"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

import SaveUserInfo from "./components/SaveUserInfo";
import { Patient } from "./components/Patient";
import { useRouter } from "next/router";
import AddPatient from "./components/patientHandling/AddPatient";
import { SignedIn } from "@clerk/nextjs";

export default function Home() {
	const [input, setInput] = useState("");
	const [data, setData] = useState([]);

	const addRow = async () => {
		try {
			const { data, error } = await supabase
				.from("entries")
				.insert([{ content: input }]); // Adjust to match your column name and table

			if (error) throw error;
			alert("Row added!");
			setInput("");
		} catch (error) {
			console.error("Error adding row:", error.message);
		}
	};

	const fetchData = async () => {
		try {
			const { data, error } = await supabase.from("entries").select("*");

			if (error) throw error;
			setData(data);
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	return (
		<div className="mx-48 my-20 ">
			<SignedIn>
				<AddPatient />
				<Patient />
			</SignedIn>
		</div>
	);
}
