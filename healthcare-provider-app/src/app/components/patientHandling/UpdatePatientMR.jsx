import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import { supabase } from '@/utils/supabase/supabaseClient'; // Adjust the import path as needed
import { useUser } from '@clerk/nextjs'; // Import the useUser hook from Clerk

function UpdatePatientMR() {
  const [form] = Form.useForm();
  const { user } = useUser();
  const [patientID, setPatientID] = useState(null);

  useEffect(() => {
    const fetchPatientID = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('Patient')
            .select('patientID')
            .eq('username', user.username)
            .single();

          if (error) throw error;

          if (data) {
            setPatientID(data.patientID);
          } else {
            message.error('Patient not found');
          }
        } catch (error) {
          console.error('Error fetching patient ID:', error);
          message.error('Failed to fetch patient information');
        }
      }
    };

    fetchPatientID();
  }, [user]);

  const handleSubmit = async (values) => {
    if (!patientID) {
      message.error('Patient ID not found. Please try again later.');
      return;
    }

    try {
      // Insert data into MedicalHistory table
      const { error: medicalHistoryError } = await supabase
        .from('MedicalHistory')
        .insert({ ...values.medicalHistory, patientID });

      if (medicalHistoryError) throw medicalHistoryError;

      // Insert data into PastHospitalization table
      const { error: pastHospitalizationError } = await supabase
        .from('PastHospitalization')
        .insert({ ...values.pastHospitalization, patientID });

      if (pastHospitalizationError) throw pastHospitalizationError;

      // Insert data into PastSurgery table
      const { error: pastSurgeryError } = await supabase
        .from('PastSurgery')
        .insert({ ...values.pastSurgery, patientID });

      if (pastSurgeryError) throw pastSurgeryError;

      // Insert data into PatientImmunizations table
      const { error: patientImmunizationsError } = await supabase
        .from('PatientImmunizations')
        .insert({ ...values.patientImmunizations, patientID });

      if (patientImmunizationsError) throw patientImmunizationsError;

      message.success('Patient medical record updated successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error updating patient medical record:', error);
      message.error('Failed to update patient medical record. Please try again.');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <h2>Medical History</h2>
      <Form.Item name={['medicalHistory', 'condition']} label="Condition" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['medicalHistory', 'diagnosisDate']} label="Diagnosis Date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name={['medicalHistory', 'treatmentID']} label="Treatment ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <h2>Past Hospitalization</h2>
      <Form.Item name={['pastHospitalization', 'hospital']} label="Hospital" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['pastHospitalization', 'hospitalizationDate']} label="Hospitalization Date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>

      <h2>Past Surgery</h2>
      <Form.Item name={['pastSurgery', 'surgeryID']} label="Surgery ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['pastSurgery', 'surgeryDate']} label="Surgery Date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name={['pastSurgery', 'institution']} label="Institution" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <h2>Patient Immunizations</h2>
      <Form.Item name={['patientImmunizations', 'surgeryID']} label="Surgery ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['patientImmunizations', 'surgeryDate']} label="Surgery Date" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name={['patientImmunizations', 'institution']} label="Institution" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Patient Medical Record
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UpdatePatientMR;
