import React from "react";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 my-4 mr-4 rounded-3xl">
        <div className="relative shadow rounded-lg overflow-hidden h-[96.5vh] flex flex-col bg-gray-200 ">
          Home
        </div>
      </div>
    </div>
  );
};

export default Home;
