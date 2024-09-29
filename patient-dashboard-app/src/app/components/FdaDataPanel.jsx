import React, { useState } from "react";
import { Collapse, message } from "antd";
import { RobotOutlined } from "@ant-design/icons"; // Import the icon
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkGfm from "remark-gfm"; // Import the plugin

const { Panel } = Collapse;

const FdaDataPanel = ({ prescription, fdaData }) => {
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [activeKey, setActiveKey] = useState([]); // Set to empty array to keep it closed by default
	const [showSummary, setShowSummary] = useState(false); // Add state to toggle summary

	const generateSummary = async () => {
		const fdaInfo = fdaData[prescription.prescriptionID];
		if (fdaInfo) {
			const text = Object.entries(fdaInfo)
				.map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
				.join("\n");

			setError("");
			setLoading(true);

			try {
				const res = await fetch("/api/perplexity", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ prompt: text }),
				});

				const data = await res.json();
				if (data.error) {
					setError(data.error);
				} else {
					setResponse(data.choices[0].message.content); // Adjust based on the actual API response format
					setShowSummary(true); // Show the summary
				}
			} catch (err) {
				setError("An error occurred while fetching the response.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		} else {
			message.error("FDA data not available");
		}
	};

	const toggleSummary = () => {
		if (showSummary) {
			setShowSummary(false);
		} else {
			generateSummary();
		}
	};

	return (
		<>
			<Collapse
				activeKey={activeKey}
				onChange={setActiveKey}
				className={showSummary ? "bg-blue-100" : "bg-white"} // Tailwind CSS classes for box color
			>
				<Panel
					header={
						<span>
							{showSummary ? "AI Summary" : "FDA Information"}
						</span>
					}
					key="1"
					extra={
						<div style={{ display: "flex", alignItems: "center" }}>
							<RobotOutlined
								onClick={toggleSummary}
								style={{
									cursor: "pointer",
									fontSize: "24px",
									marginRight: "8px",
								}}
							/>
							<span
								onClick={toggleSummary}
								style={{ cursor: "pointer" }}
							>
								{loading
									? "Loading..."
									: showSummary
									? "Show Original"
									: "Use AI to summarize"}
							</span>
						</div>
					}
				>
					{showSummary ? (
						<div className="response bg-sky-600 p-10 -m-4 rounded-b-lg text-white text-lg">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{response}
							</ReactMarkdown>
						</div>
					) : fdaData[prescription.prescriptionID] ? (
						Object.entries(
							fdaData[prescription.prescriptionID]
						).map(([key, value]) => (
							<p key={key}>
								<strong>{key.replace(/_/g, " ")}:</strong>{" "}
								{value}
							</p>
						))
					) : (
						<p>FDA data not available</p>
					)}
				</Panel>
			</Collapse>
			{error && <div className="error">{error}</div>}
		</>
	);
};

export default FdaDataPanel;
