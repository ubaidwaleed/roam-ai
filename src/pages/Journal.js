import Sidebar from "../components/Sidebar";
import React, { useState, useRef, useEffect, menu } from "react";
import { useNavigate } from "react-router-dom";
import "./JournalStyles.css";
import {
  format,
  setMonth,
  getYear,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  getMonth,
} from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiMoreVertical } from "react-icons/fi"; // Importing an icon for the "more options" button

const Journal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState(null);
  const [clickedCell, setClickedCell] = useState(null);
  const navigate = useNavigate();

  const [events, setEvents] = useState({
    "2024-08-09": [
      { id: 1, title: "Doctor Appointment" },
      { id: 2, title: "Meeting with School" },
      { id: 3, title: "Meeting with School" },
    ],
  });

  const optionsMenuRef = useRef(null); // Reference to the options menu

  const changeYear = (offset) => {
    setCurrentDate((prev) => new Date(getYear(prev) + offset, prev.getMonth()));
  };

  const changeMonth = (monthIndex) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
  };

  const currentMonthIndex = getMonth(currentDate);

  const daysAndYearHeader = () => {
    const dateFormat = "EEEE";
    const yearFormat = "yyyy";
    const days = [];
    let startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="flex items-center justify-center p-2 mt-8" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between border-b">
        <div className="grid w-full grid-cols-7">{days}</div>
        <div className="flex flex-row items-center justify-center p-2 mr-2 space-x-2 bg-gray-300 rounded-xl">
          <button
            onClick={() => changeYear(-1)}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            <FiChevronLeft />
          </button>
          <span className="text-2xl">{format(currentDate, yearFormat)}</span>
          <button
            onClick={() => changeYear(1)}
            className="text-xl text-gray-500 hover:text-gray-700"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    );
  };

  const monthsList = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      <div className="w-20 flex flex-col justify-between py-6 bg-gray-300 rounded-xl h-[110vh] mr-4">
        {months.map((month, index) => (
          <button
            key={index}
            className={`w-20 h-12 p-2 text-xl text-center transition duration-300 ease-in-out transform rotate-90 bg-gray-400 rounded-lg 
                     hover:bg-gray-600 hover:text-white hover:scale-110
                     ${
                       index === currentMonthIndex
                         ? "bg-indigo-500 text-white"
                         : "text-gray-800"
                     }`}
            onClick={() => changeMonth(index)}
          >
            {month.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };

  const handleOptionClick = (option) => {
    if (option === "Add a Memory") {
      // Add your logic for adding a memory here
      navigate("/journal/memory");
    } else if (option === "Saved Memories") {
      // Add your logic for showing saved memories here
      alert("Saved Memories clicked!");
    }
    setClickedCell(null); // Close the menu after an option is clicked
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedCell && !event.target.closest(".cell-menu")) {
        setClickedCell(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedCell]);

  const formatDateKey = (date) => format(date, "yyyy-MM-dd");

  const cells = (journals) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, "d");
        const dateKey = formatDateKey(cloneDay);
        const dayEvents = events[dateKey] || [];
        const isHovered = hoveredCell === cloneDay.toString();
        const isClicked = clickedCell === cloneDay.toString();

        days.push(
          <div
            className={`relative border border-gray-400 flex flex-col justify-between rounded-xl h-[22vh] ${
              !isSameMonth(day, monthStart)
                ? "text-gray-300"
                : isSameDay(day, new Date())
                ? "bg-blue-500 "
                : "text-black"
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={() => setHoveredCell(cloneDay.toString())}
            onMouseLeave={() => {
              setHoveredCell(null);
              setClickedCell(null);
            }}
          >
            <div className="flex flex-row items-center justify-between">
              <span className="flex items-center justify-center w-8 h-8 p-1 m-2 bg-white rounded-full">
                {formattedDate}
              </span>

              {isHovered && (
                <div
                  className="p-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick of the cell
                    setClickedCell(cloneDay.toString());
                  }}
                >
                  <FiMoreVertical className="text-xl" />
                </div>
              )}
            </div>

            <div className="px-2">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`card shadow-md 
                  `}
                >
                  {/* Add your content or other elements here */}
                </div>
              ))}
            </div>

            {/* Options menu */}
            {isClicked && (
              <div className="absolute z-10 p-2 bg-white rounded-lg shadow-lg right-2 top-12 cell-menu">
                <div
                  className="flex flex-row items-center p-2 space-x-2 cursor-pointer hover:bg-gray-200 hover:rounded-lg"
                  onClick={() => handleOptionClick("Add a Memory")}
                >
                  <img
                    alt="add-memory"
                    src="/images/heart-add.png"
                    className="w-auto h-full"
                  />
                  <span>Add a Memory</span>
                </div>
                <div
                  className="flex flex-row items-center p-2 space-x-2 cursor-pointer hover:bg-gray-200 hover:rounded-lg"
                  onClick={() => handleOptionClick("Saved Memories")}
                >
                  <img
                    alt="saved-memory"
                    src="/images/heart.png"
                    className="w-auto h-full"
                  />
                  <span>Saved memories</span>
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 mx-6" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className="flex flex-1 overflow-y-auto calender-scrollbar">
        <div className="flex-1">{rows}</div>
        {monthsList()}
      </div>
    );
  };

  const onDateClick = (day) => {
    setCurrentDate(day);
  };

  //------------------------------------------------------------Getting journals and memories-----------------------------------//

  const userId = "66cf734dd44f053e8ca1772e";

  // State to store the fetched journals data
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        // Fetch the journal IDs
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`
        );
        const data = await response.json();

        const journalIds = data.journal_id;

        // Use Promise.all to fetch all journals concurrently
        const journalData = await Promise.all(
          journalIds.map((journalId) =>
            fetch(`http://localhost:5000/api/journals/${journalId}`)
              .then((response) => response.json())
              .catch((error) =>
                console.error(`Error fetching journal ID ${journalId}:`, error)
              )
          )
        );

        // Update state with fetched journals data
        setJournals(journalData.filter((journal) => journal !== undefined)); // Filter out any undefined results
        setLoading(false);
      } catch (error) {
        setError("Error fetching user journals");
        setLoading(false);
      }
    };

    fetchJournals();
  }, [userId]);

  // Effect to log the updated journals state
  useEffect(() => {
    if (!loading && journals.length > 0) {
      console.log("Journals:", journals);
    }
  }, [journals, loading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  //-------------------------------------------------------------------------------------------------------------------------//

  return (
    <div className="flex font-poppins">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 my-4 mr-4 rounded-3xl">
        <div className="relative shadow rounded-lg overflow-hidden h-[96.5vh] flex flex-col bg-gray-200 ">
          {daysAndYearHeader(journals)}
          {cells(journals)}
        </div>{" "}
      </div>
    </div>
  );
};

export default Journal;
