import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { supabase } from "@/utils/supabase/supabaseClient";
import { message, notification } from "antd";

const Calendar = () => {
	const [events, setEvents] = useState([]);
	const [patientID, setPatientID] = useState(null);

	useEffect(() => {
		const fetchPatientID = async () => {
			try {
				const { data: patientData, error: patientError } =
					await supabase
						.from("Patient")
						.select("patientID")
						.limit(1)
						.single();

				if (patientError) throw patientError;

				if (patientData) {
					console.log("Patient data:", patientData);
					setPatientID(patientData.patientID);
				} else {
					console.log("No patient data found");
				}
			} catch (error) {
				console.error("Error fetching patient data:", error.message);
				message.error("Failed to fetch patient data");
			}
		};

		fetchPatientID();
	}, []);

	useEffect(() => {
		const fetchPrescriptionData = async () => {
			if (!patientID) {
				console.log("No patientID available");
				return;
			}

			try {
				console.log(
					"Fetching prescription data for patientID:",
					patientID
				);

				const { data, error } = await supabase
					.from("Prescription")
					.select("*")
					.eq("patientID", patientID);

				if (error) throw error;

				console.log("Prescription data:", data);

				if (data && data.length > 0) {
					const newEvents = data.flatMap(generateEvents);
					console.log("Generated events:", newEvents);
					setEvents(newEvents);
				} else {
					console.log("No prescription data found");
				}
			} catch (error) {
				console.error(
					"Error fetching prescription data:",
					error.message
				);
				message.error("Failed to fetch prescription data");
			}
		};

		fetchPrescriptionData();
	}, [patientID]);

	const generateEvents = (prescription) => {
		console.log("Generating events for prescription:", prescription);
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
				};

				newEvents.push(event);

				// Add notification for this event
				setTimeout(() => {
					notification.info({
						message: `Medication Reminder`,
						description: `Time to take ${drugName} ${dose} ${doseUnit}`,
						duration: 0,
					});
				}, eventDate.getTime() - new Date().getTime());
			}
		}

		// Add a test event that will trigger a notification in the next minute
		const testEventDate = new Date();
		testEventDate.setMinutes(testEventDate.getMinutes() + 1);

		const testEvent = {
			title: `Test Event`,
			start: testEventDate,
			end: new Date(testEventDate.getTime() + 30 * 60000),
			allDay: false,
		};

		newEvents.push(testEvent);

		// Add notification for the test event
		setTimeout(() => {
			notification.info({
				message: `Test Notification`,
				description: `This is a test notification.`,
				duration: 0,
			});
		}, testEventDate.getTime() - new Date().getTime());

		console.log("Generated events for this prescription:", newEvents);
		return newEvents;
	};

	return (
		<div style={{ height: "500px" }}>
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
