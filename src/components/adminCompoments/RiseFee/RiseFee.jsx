import React from 'react'
// import Sidebar from '../';
import Sidebar from "../AdminLoginSignup/Sidebar";


const RiseFee = () => {
  return (
    <div className="w-full min-h-screen overflow-auto bg-[#fdf5f6]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-3 xl:col-span-2">
          <Sidebar />
        </div>

        <div className="lg:col-span-9 xl:col-span-10 p-4 sm:p-6">
          {/* <Navbar /> */}

          {/* Main Content */}
         
        </div>
      </div>

    
     
    </div>
  );
}

export default RiseFee
