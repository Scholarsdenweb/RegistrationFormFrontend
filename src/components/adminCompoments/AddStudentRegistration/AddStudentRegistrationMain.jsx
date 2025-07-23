import React, { useState } from 'react';

const AddStudentRegistrationMain = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    StudentsId: '',
    email: '',
    admitCard: '',
    profilePicture: '',
    result: '',
    paymentId: '',
    role: '',
    contactNumber: '',
    enquiryNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // Upload to backend or cloud storage here
  };

  return (
    <div className="p-4  bg-white rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Student Name', name: 'studentName' },
          { label: 'Student ID', name: 'StudentsId' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Admit Card', name: 'admitCard' },
          { label: 'Result', name: 'result' },
          { label: 'Payment ID', name: 'paymentId' },
          { label: 'Role', name: 'role', required: true },
          { label: 'Contact Number', name: 'contactNumber', required: true },
          { label: 'Enquiry Number', name: 'enquiryNumber' },
          { label: 'Password', name: 'password', type: 'password' },
        ].map(({ label, name, type = 'text', required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}{required ? ' *' : ''}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ))}

        {/* Profile Picture Upload / Camera */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm"
          />
          {formData.profilePicture && (
            <div className="mt-2">
              <img
                src={formData.profilePicture}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddStudentRegistrationMain;
