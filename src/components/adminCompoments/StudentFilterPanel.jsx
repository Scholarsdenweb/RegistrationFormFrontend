import { FiFilter, FiRefreshCcw, FiSearch } from "react-icons/fi";

const StudentFilterPanel = ({
  classValue,
  setClassValue,
  inputValue,
  setInputValue,
  handleSearchChange,
  sortOrder,
  handleSortChange,
  startingDate,
  setStartingDate,
  lastDate,
  setLastDate,
  fetchFilteredData,
  fetchAllStudents,
  classFilterOptions,
  filterApplied,
  filterValue,
}) => {
  const applyFilters = () => {
    fetchFilteredData({
      filterBy: "multiple",
      class: classValue,
      name: inputValue,
      startingDate,
      lastDate,
      sortOrder,
    });
  };

  const resetFilters = () => {
    setClassValue("");
    setInputValue("");
    setStartingDate("");
    setLastDate("");
    fetchAllStudents(sortOrder);
  };

  return (
    <section className="bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-gray-200 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <p className="text-sm text-gray-500">
            {filterValue === "all" ? "Showing all SDAT forms" : filterApplied()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#c61d23] hover:text-[#c61d23]"
          >
            <FiRefreshCcw /> Reset
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c61d23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a8191e]"
          >
            <FiFilter /> Apply Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 p-4 sm:p-5">
        <label className="block text-sm font-semibold text-gray-700">
          Search Student
          <div className="relative mt-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
              placeholder="Name"
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Class
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
            onChange={(event) => setClassValue(event.target.value)}
            value={classValue}
          >
            <option value="">All Classes</option>
            {classFilterOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          From
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
            type="date"
            value={startingDate}
            onChange={(event) => setStartingDate(event.target.value)}
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          To
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
            type="date"
            value={lastDate}
            onChange={(event) => setLastDate(event.target.value)}
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Sort
          <select
            value={sortOrder}
            onChange={(event) => handleSortChange(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#c61d23] focus:ring-2 focus:ring-[#c61d23]/15"
          >
            <option value="asc">Newest First</option>
            <option value="desc">Oldest First</option>
          </select>
        </label>
      </div>
    </section>
  );
};

export default StudentFilterPanel;
