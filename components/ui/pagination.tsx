 
import React from 'react'

const Pagination = ({totalPages,setPage,page}:{totalPages:number,setPage: React.Dispatch<React.SetStateAction<number>>,page:number}) => {
  return (
    <div>
         {totalPages > 1 && (
      <div className='flex justify-center items-center gap-4 mt-6'>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className='px-4 py-2 rounded-md border bg-[#6e56cf] text-white disabled:bg-white disabled:bordercolor disabled:text-gray-500 disabled:opacity-50'
        >
          Prev
        </button>

        <span className='text-sm font-medium'>
          {
            Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setPage(index + 1)}
                className={`px-3 py-1 mr-1 rounded-md ${page === index + 1 ? 'bg-[#4840b3e3] text-white' : ' bg-[#e4dfff]  text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))
          } 
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className='px-4 py-2 rounded-md border bg-[#6e56cf] text-white disabled:bg-white disabled:bordercolor disabled:text-gray-500 disabled:opacity-50'
        >
          Next
        </button>
      </div>
    )}
    </div>
  )
}

  
export default Pagination