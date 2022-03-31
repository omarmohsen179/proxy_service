import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <div className="my-3">
      <ReactPaginate
        previousLabel={"السابق"}
        nextLabel={"التالي"}
        breakLabel={"..."}
        breakClassName={"page-link"}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={onPageChange}
        //pagination-lg
        containerClassName={"pagination  justify-content-center"}
        activeClassName={"active active-pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        nextClassName={"page-item"}
        previousClassName={"page-item "}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
      />
    </div>
  );
};

export default Pagination;
