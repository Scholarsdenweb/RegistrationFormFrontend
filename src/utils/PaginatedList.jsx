import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ReactPaginate from "react-paginate";

const PaginatedList = ({
  apiEndpoint,
  renderItem,
  queryParams = {},
  itemsPerPage = 1, // Default to 1 item per page
  email = "",
  handleCardClick = () => {},
}) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page) => {
    try {
      setLoading(true);


      console.log("FetchData is is calling ");
      const response = await axios.post(apiEndpoint, {
        ...queryParams,
        email,
        page: page + 1,
        limit: itemsPerPage,
      });




      setItems(response.data.data || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, queryParams]);

  const handlePageClick = ({ selected }) => {
    console.log("handlePage click ");
    setCurrentPage(selected);
  };

  return (
    <div>
       {loading && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      <div className="space-y-4">
        {items.map((item, index) =>
          renderItem(item, index, () => handleCardClick(item))
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          containerClassName={"flex gap-2"}
          pageClassName={"px-4 py-2 bg-[#ffdd00] rounded shadow"}
          activeClassName={"bg-blue-500 text-black"}
          previousClassName={"px-4 py-2 bg-[#ffdd00] rounded"}
          nextClassName={"px-4 py-2 bg-[#ffdd00] rounded"}
          breakLabel={"..."}
        />
      </div>
    </div>
  );
};

export default PaginatedList;
