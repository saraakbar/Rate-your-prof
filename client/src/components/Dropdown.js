import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceKissWinkHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Dropdown.css";
import { useNavigate, NavLink } from "react-router-dom";

const UserMenuDropdown = ({ color }) => {

  const navigate = useNavigate();
  return (
    <div className="dropdown-container">
        <div className="button-container">
      <button
        className={`text-white font-bold uppercase text-sm px-4 rounded outline-none focus:outline-none ease-linear transition-all duration-150 ${
          color === "white" ? "bg-blueGray-700" : "bg-" + color + "-500"
        }`}
      >
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Username
      </button>

      <div
        className={`dropdown-content text-base bg-white text-blueGray-700 rounded-lg shadow-lg py-2 px-4`}
      >
        <button
          className="text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            const username = localStorage.getItem("username");
            if (window.location.pathname !== `/${username}/profile`) {
              navigate(`/${username}/profile`, { replace: true });
            }
          }}
        >
          Profile
        </button>
        <button
          className="text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            // Handle settings action
          }}
        >
          Settings
        </button>
        <div className="h-0 my-2 border border-solid border-t-0 border-blueGray-800 opacity-25" />
        <button
          className="text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login",{replace:true});
          }}
        >
          Logout
        </button>
      </div>
      </div>
    </div>
  );
};

export default function DropdownRender() {
  return <UserMenuDropdown color="green-400" />;
}
