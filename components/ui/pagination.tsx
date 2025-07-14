import React from 'react';
interface PaginationProps {
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}
const Pagination: React.FC<PaginationProps> = ({ totalPages, setPage, page }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    pages.push(1);
    if (page > 4) {
      pages.push('...');
    }
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) {
      pages.push('...');
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div className='rounded-xl w-[590px] text-base max-md:text-sm max-md:w-[300px] px-5  left-[30%] max-md:bottom-5 max-md:left-[15%] fixed bottom-10 right-0 bg-[#0e218e29] backdrop-blur-xl max-md:p-1  p-3 z-50'>
      {totalPages > 1 && (
        <div className='flex justify-center flex-wrap items-center gap-2 '>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className='px-4 py-2 max-md:p-2 max-md:py-1 rounded-md   bg-[#6e56cf] text-white disabled:bg-white disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Prev
          </button>

          {getPageNumbers().map((item, index) => {
            if (item === '.....') {
              return (
                <span key={`ellipsis-${index}`} className='px-2 bg-[#e4dfff] '>
                  .....
                </span>
              );
            }

            const pageNum = item as number;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={` max-md:p-2 max-md:py-0.5 px-3 py-1 rounded-md ${
                  page === pageNum
                    ? 'bg-[#4840b3e3] text-white'
                    : 'bg-[#e4dfff] text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className='px-4 py-2 max-md:p-2 max-md:py-1 rounded-md   bg-[#6e56cf] text-white disabled:bg-white disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
