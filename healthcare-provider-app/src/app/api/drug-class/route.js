// app/api/drug-class/route.js

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { drug1, drug2 } = await request.json();
    
    const apiUrl = 'https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json';
    
    // Function to fetch drug class information
    async function fetchDrugClass(rxcui) {
      const response = await fetch(`${apiUrl}?rxcui=${rxcui}`, {
        headers: {
          'Accept': 'application/json',
          // Add any other necessary headers here
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }

    // Fetch class information for both drugs
    const [data1, data2] = await Promise.all([
      fetchDrugClass(drug1),
      fetchDrugClass(drug2)
    ]);

    // Extract class information
    const classes1 = data1.rxclassDrugInfoList.rxclassDrugInfo.map(info => info.rxclassMinConceptItem.className);
    const classes2 = data2.rxclassDrugInfoList.rxclassDrugInfo.map(info => info.rxclassMinConceptItem.className);

    // Check for common classes
    const commonClasses = classes1.filter(className => classes2.includes(className));

    return NextResponse.json({ commonClasses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch drug class information' }, { status: 500 });
  }
}