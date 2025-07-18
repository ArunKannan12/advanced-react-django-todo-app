import React from 'react'
import { useTodo } from "../utils/TodoContext";
const Pagination = () => {
  const { page, setPage, totalPages } = useTodo();

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <button className="btn btn-secondary me-2" onClick={handlePrevious} disabled={page === 1}>
        Prev
      </button>
      <span className="align-self-center">Page {page} of {totalPages}</span>
      <button className="btn btn-secondary ms-2" onClick={handleNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination