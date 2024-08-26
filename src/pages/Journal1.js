import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { TextInput, Button, Select } from "@mantine/core"; // Adjust import based on actual usage
import Sidebar from "../components/Sidebar";
import "./Journal1Styles.css";
import { TbNorthStar } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { PiNotebookFill } from "react-icons/pi";
import { BsCalendarDateFill } from "react-icons/bs";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { RiSearchFill } from "react-icons/ri";

const USER = {
  _id: "ObjectId('user_id')",
  username: "John Doe",
  email: "john.doe@example.com",
  journal_id: "ObjectId('journal_id')",
  description:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  socialLinks: [
    { platform: "Twitter", url: "www.twitter.com/user-92584" },
    { platform: "Instagram", url: "www.instagram.com/user-92584" },
    { platform: "Google", url: "www.google.com/user-92584" },
    { platform: "LinkedIn", url: "www.linkedin.com/user-92584" },
  ],
};

const TravelJournal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const navigate = useNavigate();

  const getYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  };

  //--------------------------------MODAL ADD NEW MEMORY--------------------------------/
  const [openedAddMemory, { open: openAddMemory, close: closeAddMemory }] =
    useDisclosure(false);

  function handleAddMemory() {
    navigate("/journal/memory");
  }

  return (
    <>
      <div className="flex font-lexend">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content on the right */}
        <div className="flex-1">
          <div className="flex flex-col h-full overflow-hidden bg-[#e5e5ff] shadow rounded-3xl">
            {/* Header */}
            <div className="flex flex-col p-4 mx-3 mt-4 bg-[#f7f7ff] shadow rounded-t-3xl">
              <div className="flex flex-row items-center justify-between">
                {/* Page Title */}
                <h1 className="text-3xl font-bold">Your Travel Journals</h1>

                {/* Search Bar */}
                <TextInput
                  placeholder="Search"
                  leftSection={
                    <RiSearchFill className="text-[#7171a9] text-2xl" />
                  }
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.currentTarget.value)
                  }
                  radius="lg"
                  size="xl"
                  className="w-96"
                  styles={{
                    input: {
                      backgroundColor: "#e6e6ff",
                      fontSize: "1.5rem", // Equivalent to text-3xl in Tailwind
                      border: 0,
                      color: "#7171a9",
                    },
                  }}
                />

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  {/* Add Memory Button */}
                  <Button
                    leftSection={<FaPlus />}
                    variant="filled"
                    size="lg"
                    radius="lg"
                    color="#373784"
                    onClick={openAddMemory}
                  >
                    Add Memory
                  </Button>

                  {/* Month Dropdown */}
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e)}
                    data={[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ]}
                    radius="lg"
                    size="lg"
                    className="w-36"
                    color="#e4e4f3"
                    styles={{
                      input: {
                        backgroundColor: "#e6e6ff",
                        fontSize: "1.2rem", // Equivalent to text-3xl in Tailwind
                        border: 0,
                        color: "#7171a9",
                      },
                    }}
                  />

                  {/* Year Dropdown */}
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e)}
                    data={getYears(1900)}
                    radius="lg"
                    size="lg"
                    className="w-28"
                    styles={{
                      input: {
                        backgroundColor: "#e6e6ff",
                        fontSize: "1.2rem", // Equivalent to text-3xl in Tailwind
                        border: 0,
                        color: "#7171a9",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Main Content Area */}
            <div className="relative flex-1 p-6 mx-3 mb-4 bg-[#ffffff] shadow rounded-b-3xl font-gluteen">
              <div className="flex justify-between h-full">
                {/* Left Page */}
                <div className="w-1/2 pl-3 pr-2">
                  <div className="flex flex-col mt-4 space-y-16 bg-[#ffffff]">
                    <div className="flex flex-col space-y-6">
                      <div>
                        <h1 className="text-[#373784] text-4xl">Profile</h1>
                      </div>
                      <div className="flex flex-row space-x-6">
                        <div>
                          <img
                            alt="Profile picture"
                            src="/images/girl.png"
                            className="h-full w-[45vh]"
                          />
                        </div>
                        <div className="flex flex-col mt-4 space-y-4">
                          <h1 className="text-[#373784] text-4xl">
                            {USER.username}
                          </h1>
                          <h1 className="text-[#9494b1] text-3xl">
                            {USER.email}
                          </h1>
                          <h1 className="text-[#9494b1] text-2xl">
                            {USER.description}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                      <div>
                        <h1 className="text-[#373784] text-4xl">Socials</h1>
                      </div>
                      <div className="flex flex-col space-y-6">
                        {USER.socialLinks.map((link) => (
                          <div
                            className="flex flex-row space-x-3"
                            key={link.url}
                          >
                            <TbNorthStar className="text-[#373784] text-2xl" />
                            <h1 className="text-[#9494b1] text-2xl">
                              {link.url}
                            </h1>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Dashed Line */}
                <div className="h-full custom-dashed-line"></div>

                {/* Right Page */}
                <div className="w-1/2 pl-8">
                  <div className="bg-[#ffffff] flex flex-col space-y-8 mt-4">
                    <div>
                      {" "}
                      <h1 className="text-[#373784] text-4xl ">
                        August, 2024 Journals (11)
                      </h1>
                    </div>
                    <div className="flex flex-col space-y-8">
                      {" "}
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>{" "}
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>{" "}
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>{" "}
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>{" "}
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-4">
                          <h1 className="text-[#a0a0b9] text-2xl">01</h1>
                          <h1 className="text-[#373784] text-2xl">
                            My trip & Experience to Baku
                          </h1>
                        </div>
                        <div>
                          <h1 className="text-[#a0a0b9] text-2xl">
                            24th Aug 2024 - Monday
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        opened={openedAddMemory}
        onClose={closeAddMemory}
        centered
        size="lg"
      >
        <div className="flex flex-col items-center justify-center pt-4 pb-8 rounded-xl font-lexend">
          {" "}
          <div>
            {" "}
            <h1 className="text-[#373784] text-4xl mb-12 font-bold text-center">
              Authentication{" "}
            </h1>
          </div>
          <div className="flex flex-col space-y-8">
            <TextInput
              placeholder="Enter Date"
              leftSection={
                <BsCalendarDateFill className="text-2xl text-[#373784]" />
              }
              size="xl"
              radius="lg"
              className="w-[50vh]"
              styles={{
                input: {
                  backgroundColor: "#ebebf3",
                  border: 0,
                  color: "#7b7ba4",
                },
              }}
            />
            <TextInput
              placeholder="Enter Title"
              leftSection={
                <PiNotebookFill className="text-2xl text-[#373784]" />
              }
              size="xl"
              radius="lg"
              className="w-[50vh]"
              styles={{
                input: {
                  backgroundColor: "#ebebf3",
                  border: 0,
                  color: "#7b7ba4",
                },
              }}
            />
            <Button
              leftSection={<FaPlus />}
              variant="filled"
              size="xl"
              radius="lg"
              color="#373784"
              className="w-[50vh]"
              onClick={handleAddMemory}
            >
              Add Memory
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TravelJournal;
