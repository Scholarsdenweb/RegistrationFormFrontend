import React from 'react'
import Sidebar from './EmployeeeLoginSignup/Sidebar'
import Navbar from '../Form/Navbar';

const EmployeeDashboard = () => {
  return (
    <div
      className="w-full h-full overflow-auto rounded-3xl shadow-2xl "
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-5 h-full">
        {/* Spinner */}
        {/* {loading && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner />
        </div>
      )} */}

        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-4 h-full ">
          <Navbar />

          {/* Main Content Area */}

          
          <div
            className={`col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-end gap-4 overflow-auto`}
          >
         
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard    