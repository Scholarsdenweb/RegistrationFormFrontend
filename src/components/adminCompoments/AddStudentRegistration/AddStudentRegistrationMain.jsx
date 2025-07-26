import React, { useState } from "react";

import InputField from "../../../utils/Tags/InputField"

// Reusable Input Component
const Input = ({ label, name, value, onChange, type = "text", error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Utility function to update state
const updateForm = (e, setter) => {
  const { name, value } = e.target;
  setter((prev) => ({ ...prev, [name]: value }));
};

// === Main Multi-step Form ===
const MultiStepStudentForm = () => {
  const [step, setStep] = useState(0);

  const [studentForm, setStudentForm] = useState({
    studentName: "",
    StudentsId: "",
    email: "",
    admitCard: "",
    result: "",
  });

  const [profilePreview, setProfilePreview] = useState("");

  const [basicDetails, setBasicDetails] = useState({
    dob: "",
    gender: "",
    examName: "SDAT",
    examDate: "",
    contactNumber: "",
  });

  const [batchDetails, setBatchDetails] = useState({
    classForAdmission: "",
    program: "",
  });

  const [educationDetails, setEducationDetails] = useState({
    SchoolName: "",
    Percentage: "",
    Class: "",
    YearOfPassing: "",
    Board: "",
  });

  const [familyDetails, setFamilyDetails] = useState({
    FatherName: "",
    FatherContactNumber: "",
    FatherOccupation: "",
    MotherName: "",
    MotherContactNumber: "",
    MotherOccupation: "",
    FamilyIncome: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = () => {
    console.log("Submitted Data", {
      studentForm,
      basicDetails,
      batchDetails,
      educationDetails,
      familyDetails,
    });
    alert("All data submitted!");
  };

  const handleImageChange = async () => {};

  const steps = [
    {
      title: "Basic Details",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Student Name"
            name="studentName"
            value={studentForm.studentName}
            onChange={(e) => updateForm(e, setStudentForm)}
          />
          <InputField
            label="Email"
            name="email"
            value={studentForm.email}
            onChange={(e) => updateForm(e, setStudentForm)}
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={basicDetails.dob}
            onChange={(e) => updateForm(e, setBasicDetails)}
          />
          <Input
            label="Gender"
            name="gender"
            value={basicDetails.gender}
            onChange={(e) => updateForm(e, setBasicDetails)}
          />
        
          <Input
            label="Exam Date"
            name="examDate"
            value={basicDetails.examDate}
            onChange={(e) => updateForm(e, setBasicDetails)}
          />
          <Input
            label="Contact Number"
            name="contactNumber"
            value={basicDetails.contactNumber}
            onChange={(e) => updateForm(e, setBasicDetails)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Profile Picture
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-4 mb-3">
              Allowed file types: JPG, JPEG, PNG <br />
              Max size: 2MB
            </div>

            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleImageChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {profilePreview && (
              <div className="mt-3">
                <p className="text-sm text-green-600">
                  Image uploaded successfully.
                </p>
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="mt-2 h-32 rounded-md border"
                />
              </div>
            )}

            {/* {errors.profilePicture && (
            <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
          )} */}
          </div>
        </div>
      ),
    },
    {
      title: "Batch Details",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Class for Admission"
            name="classForAdmission"
            value={batchDetails.classForAdmission}
            onChange={(e) => updateForm(e, setBatchDetails)}
          />
          <Input
            label="Program"
            name="program"
            value={batchDetails.program}
            onChange={(e) => updateForm(e, setBatchDetails)}
          />
         
        </div>
      ),
    },
    {
      title: "Educational Details",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="School Name"
            name="SchoolName"
            value={educationDetails.SchoolName}
            onChange={(e) => updateForm(e, setEducationDetails)}
          />
          <Input
            label="Percentage"
            name="Percentage"
            value={educationDetails.Percentage}
            onChange={(e) => updateForm(e, setEducationDetails)}
          />
          <Input
            label="Class"
            name="Class"
            value={educationDetails.Class}
            onChange={(e) => updateForm(e, setEducationDetails)}
          />
          <Input
            label="Year Of Passing"
            name="YearOfPassing"
            value={educationDetails.YearOfPassing}
            onChange={(e) => updateForm(e, setEducationDetails)}
          />
          <Input
            label="Board"
            name="Board"
            value={educationDetails.Board}
            onChange={(e) => updateForm(e, setEducationDetails)}
          />
        </div>
      ),
    },
    {
      title: "Family Details",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Father Name"
            name="FatherName"
            value={familyDetails.FatherName}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Father Contact Number"
            name="FatherContactNumber"
            value={familyDetails.FatherContactNumber}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Father Occupation"
            name="FatherOccupation"
            value={familyDetails.FatherOccupation}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Mother Name"
            name="MotherName"
            value={familyDetails.MotherName}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Mother Contact Number"
            name="MotherContactNumber"
            value={familyDetails.MotherContactNumber}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Mother Occupation"
            name="MotherOccupation"
            value={familyDetails.MotherOccupation}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
          <Input
            label="Family Income"
            name="FamilyIncome"
            value={familyDetails.FamilyIncome}
            onChange={(e) => updateForm(e, setFamilyDetails)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-3xl shadow-xl h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {steps[step].title}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          step === steps.length - 1 ? handleFinalSubmit() : handleNext();
        }}
        className="space-y-6  "
      >
        {steps[step].content}

        <div className="flex justify-between pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="py-2 px-6 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="ml-auto py-2 px-6 rounded-md text-white font-medium transition duration-200 bg-blue-600 hover:bg-blue-700"
          >
            {step === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepStudentForm;
