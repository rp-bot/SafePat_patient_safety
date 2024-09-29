// app/components/DrugClassChecker.js

"use client";

import { useState } from "react";

export default function DrugClassChecker() {
	const [drug1, setDrug1] = useState("");
	const [drug2, setDrug2] = useState("");
	const [commonClasses, setCommonClasses] = useState([]);

	// Function to check drug classes
	async function checkDrugClasses(drug1Rxcui, drug2Rxcui) {
		try {
			const response = await fetch("/api/drug-class", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ drug1: drug1Rxcui, drug2: drug2Rxcui }),
			});

			const data = await response.json();
			setCommonClasses(data.commonClasses);
		} catch (error) {
			console.error("Error fetching common classes:", error);
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		checkDrugClasses(drug1, drug2);
	};

	return (
		<div>
			<h1>Check Drug Classes</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={drug1}
					onChange={(e) => setDrug1(e.target.value)}
					placeholder="Enter RXCUI for Drug 1"
					required
				/>
				<input
					type="text"
					value={drug2}
					onChange={(e) => setDrug2(e.target.value)}
					placeholder="Enter RXCUI for Drug 2"
					required
				/>
				<button type="submit">Check Classes</button>
			</form>
			{commonClasses.length > 0 && (
				<div>
					<h2>Common Classes:</h2>
					<ul>
						{commonClasses.map((className, index) => (
							<li key={index}>{className}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
