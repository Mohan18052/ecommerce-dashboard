function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(
            currentPage - 1
          )
        }
      >
        Previous
      </button>

      {[
        ...Array(totalPages),
      ].map((_, index) => (
        <button
          key={index}
          onClick={() =>
            setCurrentPage(
              index + 1
            )
          }
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          setCurrentPage(
            currentPage + 1
          )
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;