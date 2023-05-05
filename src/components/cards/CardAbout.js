import React from "react";
import CardMission from "./cardAbout/CardMission";

export default function CardAbout() {
  return (
    <div className="container">
      <div className="md:grid md:grid-cols-2 md:gap-10">
        <div className="relative">
          <div
            style={{ backgroundImage: 'url("/img/ImageAbout1.webp")' }}
            className="w-full bg-cover bg-no-repeat bg-center relative h-[400px] md:h-[535px]"
          >
            <div className="cursor-pointer hidden md:block lg:hidden absolute bottom-0 right-0 -mr-9 top-1/3">
              <svg
                className="text-[#ffd369]"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="80px"
                width="80px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
              </svg>
            </div>
          </div>
          <div className="pulse hidden md:hidden lg:block absolute right-0 -mr-9 bottom-0 top-1/3">
            <svg
              className="text-[#ffd369]"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="80px"
              width="80px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
            </svg>
          </div>
          <div className="block absolute bottom-0 left-1/3 top-1/3 mt-5 md:hidden lg:hidden">
            <svg
              className="text-[#ffd369] w-24"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="80px"
              width="80px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
            </svg>
          </div>
        </div>
        <div className="py-10">
          <div className="flex flex-col lg:gap-4">
            <p className="text-gray-400"> Welcome to Readit</p>
            <h2 className="font-bold text-gray-800 text-3xl">
              We give you the best articles yout want.
            </h2>
            <p className="text-gray-400 mt-4 text-sm mb-4">
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia
            </p>
            <CardMission />
          </div>
        </div>
      </div>
    </div>
  );
}
