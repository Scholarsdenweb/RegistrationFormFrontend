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
    <div className="rounded-2xl bg-white/85 border border-white shadow-[0_16px_40px_rgba(157,23,33,0.06)] p-4 sm:p-5 mb-4 flex flex-wrap gap-3 items-end justify-between">
      {/* Class Filter */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-gray-700 text-sm font-semibold">Select Class</label>
        <select
          className="w-full sm:w-44 p-3 rounded-xl appearance-none bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
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
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-gray-700 text-sm font-semibold">Search by Name</label>
        <input
          className="p-3 rounded-xl bg-white w-full sm:min-w-64 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c61d23]/30"
          placeholder="Search By Name"
          type="text"
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Sort and Date Range */}
      <div className="flex flex-col items-start sm:items-end gap-2 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center bg-[#faf7f7] py-2 px-3 rounded-xl gap-2 w-full sm:w-auto border border-gray-200">
          <span className="sm:mr-2 text-gray-700 text-sm">Sort by Date:</span>
          <div>
            <button
              onClick={() => handleSortChange("desc")}
              className={`px-3 py-2 rounded-l-md text-sm ${
                sortOrder === "desc" ? "bg-[#c61d23] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Oldest First
            </button>
            <button
              onClick={() => handleSortChange("asc")}
              className={`px-3 py-2 rounded-r-md text-sm ${
                sortOrder === "asc" ? "bg-[#c61d23] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Newest First
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-[#fff4de] border border-[#f5d59a] items-start sm:items-center px-3 rounded-xl py-3 w-full sm:w-auto">
          <input
            className="p-2 rounded-xl w-full sm:w-auto"
            type="date"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
          />
          <p className="text-sm">to</p>
          <input
            className="p-2 rounded-xl w-full sm:w-auto"
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
          />
          <button
            className="bg-[#c61d23] text-white rounded-xl px-4 py-2 w-full sm:w-auto hover:bg-[#a8191f] transition"
            onClick={fetchFilteredData}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Filter Description */}
      {filterValue !== "all" && (
        <span className="px-3 py-2 text-sm text-[#7f1d1d] bg-[#fde9ea] border border-[#f5c9cc] rounded-lg">{filterApplied()}</span>
      )}
    </div>
  );
};

export default StudentFilterPanel;
