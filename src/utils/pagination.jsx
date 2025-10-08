// 페이지네이션 계산 함수들

// 현재 페이지 반환
export const getCurrentPageData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

// 전체 페이지 수
export const getTotalPages = (data, itemsPerPage) => {
  return Math.ceil(data.length / itemsPerPage);
};

// 이전 페이지 번호
export const getPrevPage = (currentPage) => {
  return Math.max(1, currentPage - 1);
};

// 다음 페이지 번호
export const getNextPage = (currentPage, totalPages) => {
  return Math.min(totalPages, currentPage + 1);
};

// 페이지 번호 유효성 검사
export const isValidPageNumber = (pageNumber, totalPages) => {
  return pageNumber >= 1 && pageNumber <= totalPages;
};