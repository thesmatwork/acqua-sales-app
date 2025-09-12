import React, { useState } from 'react';
import axios from 'axios';

const CreateInternalUserForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // 🔹 API call to register internal user
      const response = await axios.post('https://d28c5r6pnnqv4m.cloudfront.net/fastapi/api/register', formData);

      console.log('User created:', response.data);
      alert('Internal user registered successfully!');
      setFormData({ name: '', email: '', password: '', role: '', company: '' }); // reset
      onClose();

    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to register internal user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Role *</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
        >
          <option value="">Select Role</option>
          <option value="internal">Admin</option>
          <option value="portal">Support</option>
          <option value="public">Manager</option>
        </select>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Company *</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </div>
    </form>
  );
};

export default CreateInternalUserForm;
