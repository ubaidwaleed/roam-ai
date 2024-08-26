import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Hook to get the current location object

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-[7.6vh] h-screen bg-white text-black py-5 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center mt-8">
        <div>
          <img className="mb-10" alt="logo" src="/images/ai-logo.png" />
        </div>
        <div className="space-y-4">
          <div>
            <Link to="/">
              <img
                alt="msg"
                src="/images/messages.png"
                className={`p-2 rounded-xl ${
                  isActive("/") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>
          <div>
            <Link to="/journal">
              <img
                alt="menu"
                src="/images/menu-board.png"
                className={`p-2 rounded-xl ${
                  isActive("/journal") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>{" "}
          <div>
            <Link to="/journal1">
              <img
                alt="menu"
                src="/images/menu-board.png"
                className={`p-2 rounded-xl ${
                  isActive("/journal1") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>{" "}
          <div>
            <Link to="/about">
              <img
                alt="settings"
                src="/images/setting-2.png"
                className={`p-2 rounded-xl ${
                  isActive("/about") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>{" "}
          <div>
            <Link to="/about">
              <img
                alt="user"
                src="/images/frame.png"
                className={`p-2 rounded-xl ${
                  isActive("/about") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>{" "}
          <div>
            <Link to="/about">
              <img
                alt="notification"
                src="/images/notification-status.png"
                className={`p-2 rounded-xl ${
                  isActive("/about") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
                }`}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Link to="/logout">
          <img
            alt="logout"
            src="/images/logout.png"
            className={`p-2 rounded-xl ${
              isActive("/logout") ? "bg-[#e5e5ff]" : "hover:bg-[#e5e5ff]"
            }`}
          />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
