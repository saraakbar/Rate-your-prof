import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DropdownRender from "./Dropdown";

export default function Navbar2(props) {
  return (
    <>
      <nav
        className={
          (props.transparent
            ? "top-0 absolute z-50 w-full bg-green-400"
            : "relative shadow-lg bg-green-400 shadow-lg") +
          " flex flex-wrap items-center justify-between px-2 py-3 "
        }
      >
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="#pablo"
            >
              RATE YOUR PROFESSOR
            </a>
            
          </div>

          <div className="inline-flex items-center" id="example-navbar-warning">
          <div className="flex items-center">
          <DropdownRender />
              <button className="ml-2 mr-2 hover:bg-emerald-500 hover:text-white text-white font-bold uppercase text-sm  px-4 rounded-lg">Home</button>
              <button className="ml-2 hover:bg-emerald-500 hover:text-white text-white font-bold uppercase text-sm  px-4 rounded-lg">Teachers</button>
            </div>
        

            <div className=" flex w-full sm:w-7/12 md:w-5/12 px-4 lg:ml-auto">
            
              <div className="flex">
                <span className="font-normal leading-snug flex text-center white-space-no-wrap border border-solid border-emerald-600 rounded-full text-sm bg-emerald-100 items-center rounded-r-none pl-2 py-1 text-green-800 border-r-0 placeholder-emerald-300">
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                </span>
              </div>
              <input
                type="text"
                className="px-2 py-1 h-8 border border-solid border-emerald-600 rounded-full text-sm leading-snug text-emerald-500 bg-emerald-100 shadow-none outline-none focus:outline-none w-2/3 font-normal rounded-l-none flex-1 border-l-0 placeholder-gray-900"
                placeholder="Search Teachers"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
