import Neeche from "../../assets/Neeche.png";

const SelectField = ({ label, name, value, options, onChange, error, classAdded }) => {

  return (
    <div className={`flex flex-col rounded-xl w-full appearance-none ${classAdded}`}>
      {/* <div className="w-full"> */}

      {label !== "Select Relation" && label !== "Select Class" && (
        <label htmlFor={name} className="text-sm font-semibold mb-1">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 text-black rounded-lg p-2 focus:ring-2 w-full focus:ring-yellow-400 focus:outline-none pr-2 appearance-none"
        style={{
          backgroundImage: `url(${Neeche})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          backgroundSize: "16px",
        }}
      >
        <option value=" " className=" ">
          {label}
        </option>
        {options && options?.map((option) => (
          <option
            className=" text-black border-2 border-black-2 rounded-lg p-3 "
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-[#ffdd00] text-sm mt-1">{error}</span>}
      {/* </div> */}
    </div>
  );
};

export default SelectField;
