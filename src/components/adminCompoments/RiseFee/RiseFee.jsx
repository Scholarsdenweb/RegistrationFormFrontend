import React from 'react'
// import Sidebar from '../';
import Sidebar from "../AdminLoginSignup/Sidebar";


const RiseFee = () => {
  return (
    <div className="w-full h-full overflow-auto bg-[#c61d23]">
      <div className="grid grid-cols-7 h-full">
        {/* Sidebar */}
        <div className="col-span-2">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-5 h-full py-6">
          {/* <Navbar /> */}

          {/* Main Content */}
         
        </div>
      </div>

    
     
    </div>
  );
}

export default RiseFee