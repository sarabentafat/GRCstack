import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/apiCalls/profileApiCall";

const Calendar = () => {
  const [streakDays, setStreakDays] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile.profile);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserProfile(authUser._id));
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (userProfile?.statistics?.streakDays) {
      const filteredDays = userProfile.statistics.streakDays
        .filter((date) => {
          const day = new Date(date);
          return (
            day.getFullYear() === currentYear && day.getMonth() === currentMonth
          );
        })
        .map((date) => new Date(date).getDate());
      setStreakDays(filteredDays);
    }
  }, [userProfile, currentYear, currentMonth]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const daysArray = [];
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }
    return daysArray;
  };

  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isNextMonthDisabled = () => {
    return (
      currentYear === new Date().getFullYear() &&
      currentMonth >= new Date().getMonth()
    );
  };

  return (
    <div className="flex justify-center ">
      <div className="  text-sm flex flex-col bg-white dark:bg-second rounded-lg p-2 items-center w-80 md:mx-auto">
        <div className=" flex w-full justify-between items-center mb-2">
          <div className="font-bold">My progress</div>
          <div className="flex  items-center  text-gray-700">
            <button onClick={handlePreviousMonth} className="md:p-1 rounded-lg">
              {"<"}
            </button>
            <h2 className="font-bold">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className={`md:p-1 rounded-lg ${
                isNextMonthDisabled() ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isNextMonthDisabled()}
            >
              {">"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 md:gap-2">
          {generateCalendarDays().map((day) => (
            <div
              key={day}
              className={`w-10 h-10 flex justify-center items-center ${
                streakDays.includes(day)
                  ? "bg-orange-500 text-white rounded-full"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
