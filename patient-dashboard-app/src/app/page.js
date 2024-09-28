"use client";
import React from "react";
import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

import { useRouter } from "next/router";

import { SignedIn } from "@clerk/nextjs";
import CheckPatientData from "./components/CheckPatientData";
import PopulatePrescriptions from "./components/PopulatePrescriptions";
export default function page() {
	return (
		<div className="mx-48 my-20 ">
			<SignedIn>
				{/* <div className="flex flex-row justify-center items-center"></div> */}
				<CheckPatientData />
				<PopulatePrescriptions />
			</SignedIn>
		</div>
	);
}
