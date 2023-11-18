import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DropdownRender from "./Dropdown";
import { useNavigate } from "react-router-dom";

export default function Navbar2({transparent, fName}) {
  const [searchValue, setSearchValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const handleSearch = () => {
    setIsPressed(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <nav
        className={
          (transparent
            ? "top-0 absolute z-50 w-full bg-green-400"
            : "relative shadow-lg bg-green-400 shadow-lg") +
          " flex flex-wrap items-center justify-between px-2 py-3 "
        }
      >
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
            <p
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            >
              RATE YOUR PROFESSOR
            </p>
            
          </div>

          <div className="inline-flex items-center">
          <DropdownRender fName={fName}/>
              <button className="mr-2  hover:text-gray-600 text-white font-bold uppercase text-sm  px-4 rounded-lg">Home</button>
              <button className="ml-2  hover:text-gray-600 text-white font-bold uppercase text-sm  px-4 rounded-lg" 
              onClick ={(e)=>{
                e.preventDefault()
                navigate('/teachers',{replace:true})
              }}
              >Teachers</button>
            <div className=" flex w-full sm:w-7/12 md:w-5/12 px-4 lg:ml-auto">
       
                <span className="font-normal leading-snug flex text-center white-space-no-wrap border border-solid border-emerald-600 rounded-full text-sm bg-emerald-100 items-center rounded-r-none pl-2 py-1 text-green-800 border-r-0 placeholder-emerald-300">
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                </span>
              <input
                type="text"
                className="px-2 py-1 h-8 border border-solid border-emerald-600 rounded-full text-sm leading-snug text-emerald-500 bg-emerald-100 shadow-none outline-none focus:outline-none w-2/3 font-normal rounded-l-none flex-1 border-l-0 placeholder-gray-900"
                placeholder="Search Teachers"
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
