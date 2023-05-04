import React from "react";
import { BsArrowDown } from "react-icons/bs";

export default function Hero() {
  return (
    <div
      className="relative  bg-no-repeat bg-center bg-cover h-[500px] md:h-[600px] xl:h-[800px]"
      style={{ backgroundImage: "url('/img/bg1.jpg')" }}
    >
      <div className="bg-overlay"></div>
      <div className="container">
        <div className="flex flex-wrap items-center mr-0 ml-0 h-[550px] md:h-[600px] xl:h-[800px]  ">
          <div className="relative z-10 pr-0 pl-0 w-full sm:w-1/2 md:w-2/3 xl:w-4/5">
            <h2 className="text-sm sm:text-lg text-white font-black mb-0 xl:my-4">
              {" "}
              Hello! Welcome to
            </h2>
            <h1 className="ftn-size text-white font-bold sm:text-3xl lg:text-6xl xl:my-8">
              Readit blog
            </h1>
            <p className="text-white text-md lg:my-4 lg:text-xl">
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia, there live the blind texts. Separated
              they live in Bookmarksgrove right at the coast of the Semantics, a
              large language ocean.
            </p>

            <BsArrowDown className="text-white text-4xl absolute left-0 -bottom-20 md:-bottom-52 z-20 cursor-pointer animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
