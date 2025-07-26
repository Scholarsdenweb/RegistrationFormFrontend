// components/StudentFilterPanel.jsx
import React from "react";

const StudentFilterPanel = ({
  classValue,
  setClassValue,
  inputValue,
  setInputValue,
  handleChangeClassFilter,
  handleSearchChange,
  sortOrder,
  handleSortChange,
  startingDate,
  setStartingDate,
  lastDate,
  setLastDate,
  fetchFilteredData,
  classFilterOptions,
  filterApplied,
  filterValue,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-end justify-between">
      {/* Class Filter */}
      <div className="flex flex-col border-1">
        <label className="text-black">Select Class</label>
        <select
          className="w-40 p-4 rounded-xl appearance-none "
          onChange={handleChangeClassFilter}
          value={classValue}
        >
          <option value="Select Class">Select Class</option>
          {classFilterOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Name Filter */}
      <div className="flex flex-col">
        <label className="text-black">Search by Name</label>
        <input
          className="p-4 rounded-xl"
          placeholder="Search by Name"
          type="text"
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Sort and Date Range */}
      <div className="flex flex-col items-end gap-2 w-full">
        <div className="flex items-center bg-white py-1 pl-3 pr-1 rounded-xl justify-around">
          <span className="mr-2 text-gray-700">Sort by Date:</span>
          <div>
            <button
              onClick={() => handleSortChange("desc")}
              className={`px-3 py-1 rounded-l-md ${
                sortOrder === "desc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Oldest First
            </button>
            <button
              onClick={() => handleSortChange("asc")}
              className={`px-3 py-1 rounded-r-md ${
                sortOrder === "asc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Newest First
            </button>
          </div>
        </div>

        <div className="flex gap-4 bg-[#ffdd00] items-center px-3 rounded-xl py-2">
          <input
            className="p-2 rounded-xl"
            type="date"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
          />
          <p>to</p>
          <input
            className="p-2 rounded-xl"
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
          />
          <button
            className="bg-white rounded-xl px-3 py-2"
            onClick={fetchFilteredData}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Filter Description */}
      {filterValue !== "all" && (
        <span className="p-2 text-white rounded-sm">{filterApplied()}</span>
      )}
    </div>
  );
};

export default StudentFilterPanel;
