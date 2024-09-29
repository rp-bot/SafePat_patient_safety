import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Button, message } from 'antd';
import moment from 'moment';
import { supabase } from '../utils/supabaseClient';

const MedicalProfile = ({ patientID }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [patientID]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Patient')
      .select('date_of_birth, contact, insuranceID, geneticPredisposition')
      .eq('patientID', patientID)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to fetch profile data');
    } else {
      form.setFieldsValue({
        ...data,
        date_of_birth: data.date_of_birth ? moment(data.date_of_birth) : null,
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const { error } = await supabase
      .from('Patient')
      .update({
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
      })
      .eq('patientID', patientID);

    if (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } else {
      message.success('Profile updated successfully');
    }
    setLoading(false);
  };

  return (
    <div className="medical-profile">
      <h2>Edit Medical Profile</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="contact"
          label="Contact"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="insuranceID"
          label="Insurance ID"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="geneticPredisposition"
          label="Genetic Predisposition"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MedicalProfile;
