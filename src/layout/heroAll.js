import React from "react";
import { BsArrowDown } from "react-icons/bs";

export default function HeroAll({ title }) {
  return (
    <div
      className="relative  bg-no-repeat bg-center bg-cover h-[500px] md:h-[600px] xl:h-[800px]"
      style={{ backgroundImage: "url('/img/bg1.jpg')" }}
    >
      <div className="bg-overlay"></div>
      <div className="container">
        <div className="flex flex-wrap items-center mr-0 ml-0 h-[550px] md:h-[600px] xl:h-[800px]  ">
          <div className="relative z-20 pr-0 pl-0 w-full sm:w-1/2 md:w-2/3 xl:w-4/5">
            <div className="text-center relative top-36 mb-1 md:left-36">
              <h1 className="text-5xl text-white font-bold md:text-6xl lg:text-7xl xl:text-9xl">
                {title}
              </h1>
              <div className="flex justify-center mt-3 text-md ">
                <span className="text-white flex justify-center items-center font-light">
                  Home
                  <svg
                    className="text-white"
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
                    </g>
                  </svg>
                </span>
                <span className="text-white flex justify-center items-center font-light opacity-50">
                  About
                  <svg
                    className="text-white"
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
