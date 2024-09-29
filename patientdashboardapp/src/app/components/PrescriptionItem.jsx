import React from "react";
import Link from "next/link";
import FdaDataPanel from "./FdaDataPanel"; // Import the FdaDataPanel component
import { RightOutlined } from "@ant-design/icons"; // Import the RightOutlined icon

const PrescriptionItem = ({ prescription, fdaData }) => {
	// Calculate days left
	const startDate = new Date(prescription.startDate);
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + prescription.duration);
	const today = new Date();
	const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

	return (
		<li className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 ">
			<div>
				<div className="flex flex-row justify-between ">
					<p className="font-bold text-3xl text-start justify-start">
						{prescription.drugName}
					</p>
					<div className="font-bold text-3xl flex flex-col text-end justify-end gap-2">
						<p>
							{prescription.frequency} x {prescription.dose}
							{prescription.doseUnit}
						</p>
						<div className="text-lg flex flex-row gap-2 justify-end items-center ">
							<p>{daysLeft} Days Left</p>
							<Link
								href={`/prescription/${prescription.prescriptionID}`}
								passHref
								className=""
							>
								<button className="rounded-lg border-2 text-blue-500 border-blue-500 px-2 hover:bg-blue-500 hover:text-white transition-all duration-300">
									View More <RightOutlined />
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<FdaDataPanel prescription={prescription} fdaData={fdaData} />
		</li>
	);
};

export default PrescriptionItem;
