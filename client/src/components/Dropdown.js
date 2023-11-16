import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Dropdown.css";
import { useNavigate, NavLink } from "react-router-dom";
import { faSignOutAlt,faGear } from "@fortawesome/free-solid-svg-icons";

const UserMenuDropdown = ({fName}) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-container">
        <div className="button-container">
        <button
  className={` text-white font-bold uppercase text-sm px-4 rounded outline-none focus:outline-none ease-linear transition-all duration-150`}
>
  <FontAwesomeIcon icon={faUser} className="mr-2" />
  {fName}
</button>

      <div
className={`dropdown-content text-base bg-white rounded-lg shadow-lg py-2 px-4`}    >
        <button
          className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            const username = localStorage.getItem("username");
            if (window.location.pathname !== `/${username}/profile`) {
              navigate(`/${username}/profile`, { replace: true });
            }
          }}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Profile
        </button>
        <button
          className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            // Handle settings action
          }}
        >
          <FontAwesomeIcon icon={faGear} className="mr-2" />
          Settings
        </button>
        <div className="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
        <button
          className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login",{replace:true});
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
