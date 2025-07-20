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
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3">
      <button
        className="btn btn-secondary"
        onClick={handlePrevious}
        disabled={page === 1}
      >
        Prev
      </button>

      <span className="px-2 text-center">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn btn-secondary"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>

  );
};

export default Pagination