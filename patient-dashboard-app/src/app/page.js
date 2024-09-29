"use client";
import React from "react";
import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

import { useRouter } from "next/router";

import { SignedIn } from "@clerk/nextjs";
import CheckPatientData from "./components/CheckPatientData";
import PopulatePrescriptions from "./components/PopulatePrescriptions";
import Calendar from "./components/Calendar";
export default function page() {
	return (
		<div className="m-4 ">
			<SignedIn >
				{/* <div className="flex flex-row justify-center items-center"></div> */}
				<CheckPatientData />
				<div className="grid grid-cols-[.3fr_.7fr]">
				<PopulatePrescriptions />
				<Calendar />
				</div>
				
			</SignedIn>
		</div>
	);
}
