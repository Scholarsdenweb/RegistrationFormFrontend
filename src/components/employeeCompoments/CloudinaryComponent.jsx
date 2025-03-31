import React from 'react'
import Sidebar from './EmployeeeLoginSignup/Sidebar'
import { ToastContainer } from 'react-toastify'
import CloudinaryUpload from './CloudinaryUpload'

const CloudinaryComponents = () => {
  return (
    <div className="w-full h-full bg-[#c61d23] overflow-auto ">
    <ToastContainer position="top-right" autoClose={3000} /> {/* Toast Notifications */}

    <div className="grid grid-cols-5 h-full">
      {/* Left Sidebar */}
      <div className="col-span-1">
        <Sidebar />
      </div>

      {/* Right Content Area */}
      <div className="flex flex-col col-span-4 h-full py-6 px-6 bg-[#c61d23]">
        {/* <Navbar /> */}

        <CloudinaryUpload/>



        </div>
        </div>
        </div>
  )
}

export default CloudinaryComponents