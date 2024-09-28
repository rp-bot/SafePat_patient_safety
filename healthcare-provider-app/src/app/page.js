"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

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
		<div className="flex flex-col items-center p-4">
			<h1 className="text-2xl mb-4">Supabase with Next.js</h1>

			{/* Input for adding a new row */}
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="border p-2 mb-4 w-80"
				placeholder="Enter text to add"
			/>

			{/* Button to add row */}
			<button
				onClick={addRow}
				className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
			>
				Add Row
			</button>

			{/* Button to fetch data */}
			<button
				onClick={fetchData}
				className="bg-green-500 text-white px-4 py-2 rounded mb-4"
			>
				Fetch Data
			</button>

			{/* Display fetched data */}
			<div className="w-80 mt-4">
				<h2 className="text-xl mb-2">Data from Supabase:</h2>
				{data.length > 0 ? (
					<ul className="list-disc pl-4">
						{data.map((item) => (
							<li key={item.id}>{item.content}</li>
						))}
					</ul>
				) : (
					<p>No data found.</p>
				)}
			</div>
		</div>
	);
}
