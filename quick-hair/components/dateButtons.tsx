import React from 'react'
import DatePicker from 'react-datepicker';

const DateButton = ({ startDate, endDate, setEndDate, setStartDate }:
{ startDate: Date, endDate: Date, setEndDate: React.Dispatch<React.SetStateAction<Date>>, setStartDate: React.Dispatch<React.SetStateAction<Date>> }) => {
    return (
        <div className="flex w-full center !z-[2] flex-warp gap-4 max-md:gap-2 px-4 max-md:px-0 pt-2">
            <div className=' max-md:w-[120px]  '>
                <label className="text-[#6a71f3] text-sm mr-2">Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                        if (date) setStartDate(date);
                    }}
                    selectsStart
                    calendarClassName=' customclass '
                    startDate={startDate}
                    endDate={endDate}
                    popperClassName="customclass2"
                    className="border-2 !z-[2] bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1  card  text-[#6e56cf] "
                    placeholderText="Select start date"
                />
            </div>
            <div className=' max-md:w-[120px] '>
                <label className=" text-[#6a71f3] text-sm mr-2">End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                        if (date) setEndDate(date);
                    }}
                    calendarClassName='  customclass '
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    popperClassName="customclass2"
                    className="border-2 bordercolor w-[150px] center max-md:w-[120px] text-[#6e56cf] rounded-xl px-2 py-1 card "
                    placeholderText="Select end date"
                />
            </div>
        </div>
    )
}

export default DateButton