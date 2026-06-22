function usePagination(
  data,
  currentPage,
  itemsPerPage
) {
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  return data.slice(
    startIndex,
    endIndex
  );
}

export default usePagination;