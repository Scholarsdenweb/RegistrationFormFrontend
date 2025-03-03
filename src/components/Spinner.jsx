import React from "react";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Spinner = () => {

  return (
    <div
      className="absolute h-full top-0 right-0 left-0 bottom-0 flex justify-center items-center w-full  backdrop-blur-sm "
    >
      <BeatLoader
        color="black"
        loading
        margin={8}
        size={18}
        speedMultiplier={1}
      />
    </div>
  );
};

export default Spinner;
