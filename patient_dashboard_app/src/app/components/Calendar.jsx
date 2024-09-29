import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { supabase } from "@/utils/supabase/supabaseClient";
import { message, notification } from "antd";
import { useUser } from "@clerk/clerk-react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const Calendar = ({ prescriptionID }) => {
	const [events, setEvents] = useState([]);
	const [patientID, setPatientID] = useState(null);
	const { user } = useUser();

	useEffect(() => {
		// Request notification permission
		if (Notification.permission !== "granted") {
			Notification.requestPermission().then((permission) => {
				if (permission !== "granted") {
					message.error("Notification permission denied");
				}
			});
		}
	}, []);

	useEffect(() => {
		const fetchPatientID = async () => {
			try {
				if (!user) throw new Error("User not authenticated");

				const { data: patientData, error: patientError } =
					await supabase
						.from("Patient")
						.select("patientID")
						.eq("clerk_username", user.username)
						.single();

				if (patientError) throw patientError;

				if (patientData) {
					setPatientID(patientData.patientID);
				}
			} catch (error) {
				console.error("Error fetching patient data:", error.message);
				message.error("Failed to fetch patient data");
			}
		};

		if (!prescriptionID) {
			fetchPatientID();
		}
	}, [prescriptionID, user]);

	useEffect(() => {
		const fetchPrescriptionData = async () => {
			try {
				let data, error;

				if (prescriptionID) {
					({ data, error } = await supabase
						.from("Prescription")
						.select("*")
						.eq("prescriptionID", prescriptionID));
				} else if (patientID) {
					({ data, error } = await supabase
						.from("Prescription")
						.select("*")
						.eq("patientID", patientID));
				}

				if (error) throw error;

				if (data && data.length > 0) {
					const newEvents = data.flatMap(generateEvents);
					setEvents(newEvents);
				}
			} catch (error) {
				console.error(
					"Error fetching prescription data:",
					error.message
				);
				message.error("Failed to fetch prescription data");
			}
		};

		if (prescriptionID || patientID) {
			fetchPrescriptionData();
		}
	}, [prescriptionID, patientID]);

	const logPrescription = async (prescriptionID, isCompleted) => {
		const logDate = new Date().toISOString().split('T')[0];
		const logTime = new Date().toTimeString().split(' ')[0];

		const { error } = await supabase
			.from("PrescriptionLog")
			.insert([{ prescriptionID, logDate, logTime, isCompleted }]);

		if (error) {
			console.error("Error logging prescription:", error.message);
			message.error("Failed to log prescription");
		}
	};

	const handleNotificationAction = (prescriptionID, isCompleted, event) => {
		logPrescription(prescriptionID, isCompleted);
		setEvents((prevEvents) => prevEvents.filter((e) => e !== event));
		notification.close(prescriptionID); // Close the notification
	};

	const generateEvents = (prescription) => {
		const { drugName, startDate, duration, frequency, dose, doseUnit } =
			prescription;
		const newEvents = [];

		const start = new Date(startDate);
		const durationDays = parseInt(duration);
		const frequencyPerDay = parseInt(frequency);

		const startHour = 8;
		const endHour = 22;
		const timeWindowHours = endHour - startHour;

		for (let day = 0; day < durationDays; day++) {
			for (let doseNum = 0; doseNum < frequencyPerDay; doseNum++) {
				const eventDate = new Date(start);
				eventDate.setDate(eventDate.getDate() + day);

				const hourIncrement =
					(timeWindowHours / frequencyPerDay) * doseNum;
				const eventHour = startHour + hourIncrement;
				const eventMinute = (eventHour % 1) * 60;

				eventDate.setHours(Math.floor(eventHour), eventMinute, 0, 0);

				const event = {
					title: `Take ${drugName} ${dose} ${doseUnit}`,
					start: eventDate,
					end: new Date(eventDate.getTime() + 30 * 60000),
					allDay: false,
					prescriptionID: prescription.prescriptionID,
				};

				newEvents.push(event);

				// Add notification for this event
				const notificationTime =
					eventDate.getTime() - new Date().getTime();
				console.log(
					`Notification for ${drugName} scheduled in ${notificationTime} ms`
				);
				if (notificationTime > 0) {
					setTimeout(() => {
						console.log(`Triggering notification for ${drugName}`);
						notification.open({
							key: prescription.prescriptionID, // Unique key for the notification
							message: `Medication Reminder`,
							description: (
								<div>
									<p>
										Time to take {drugName} {dose}{" "}
										{doseUnit}
									</p>
									<div>
										<button
											onClick={() =>
												handleNotificationAction(
													prescription.prescriptionID,
													true,
													event
												)
											}
											className="m-2 bg-green-500 text-white p-2 rounded-md"
										>
											<CheckCircleOutlined /> Taken
										</button>
										<button
											onClick={() =>
												handleNotificationAction(
													prescription.prescriptionID,
													false,
													event
												)
											}
											className="m-2 bg-red-500 text-white p-2 rounded-md"
										>
											<CloseCircleOutlined /> Missed
										</button>
									</div>
								</div>
							),
							duration: 0, // Prevent auto-close
							closeIcon: null, // Remove the close button
						});
					}, notificationTime);
				}
			}
		}

		return newEvents;
	};

	return (
		<div className="h-[500px] overflow-y-auto">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				events={events}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				slotMinTime="08:00:00"
				slotMaxTime="22:00:00"
			/>
		</div>
	);
};

export default Calendar;