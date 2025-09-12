import React, { useState } from 'react';
import axios from 'axios';

const CreateCustomerForm = ({ onClose, onSubmit }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    country_id: '',
    state_id: '',
    zip: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      customerData.name &&
      customerData.phone &&
      customerData.street &&
      customerData.city &&
      customerData.country_id &&
      customerData.state_id &&
      customerData.zip
    ) {
      try {
        setLoading(true);

        const requestBody = {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          street: customerData.street,
          city: customerData.city,
          state_id: parseInt(customerData.state_id, 10),
          country_id: parseInt(customerData.country_id, 10),
          zip: customerData.zip
        };

        const response = await axios.post(
          'https://d28c5r6pnnqv4m.cloudfront.net/fastapi/odoo/contacts/',
          requestBody,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        console.log('Customer created:', response.data);
        alert('Customer created successfully!');
        onSubmit(response.data); // send API response back
        onClose();
      } catch (error) {
        console.error('Error creating customer:', error.response ? error.response.data : error.message);
        alert('Failed to create customer. See console for details.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill all required fields (*)');
    }
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
        <input
          type="text"
          value={customerData.name}
          onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
        <input
          type="tel"
          value={customerData.phone}
          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={customerData.email}
          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Address Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
        <input
          type="text"
          value={customerData.street}
          onChange={(e) => setCustomerData({ ...customerData, street: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
        <input
          type="text"
          value={customerData.city}
          onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Country ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Country ID *</label>
        <input
          type="number"
          value={customerData.country_id}
          onChange={(e) => setCustomerData({ ...customerData, country_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* State ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State ID *</label>
        <input
          type="number"
          value={customerData.state_id}
          onChange={(e) => setCustomerData({ ...customerData, state_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* ZIP */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP *</label>
        <input
          type="text"
          value={customerData.zip}
          onChange={(e) => setCustomerData({ ...customerData, zip: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Customer'}
        </button>
      </div>
    </div>
  );
};

export default CreateCustomerForm;
