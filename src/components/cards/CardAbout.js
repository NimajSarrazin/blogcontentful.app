import React from "react";
import CardMission from "./cardAbout/CardMission";

export default function CardAbout() {
  return (
    <div className="container lg:px-10">
      <div className="lg:flex lg:space-x-12">
        <div className="relative">
          <img
            className="w-auto"
            src="/img/ImageAbout1.webp"
            alt="ImageAbout1 woman with black glasse"
          />
          <div>
            <div className="hidden md:hidden lg:block absolute -right-12 bottom-0 top-1">
              <svg
                className="text-yellow-500 w-20"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height=""
                width=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
              </svg>
            </div>
            <div className="hidden md:block lg:hidden absolute top-1/3 left-72">
              <svg
                className="text-yellow-500 w-32"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height=""
                width=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
              </svg>
            </div>
            <div className="block absolute top-1/3 left-1/3 md:hidden lg:hidden">
              <svg
                className="text-yellow-500 w-24"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height=""
                width=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="py-10">
          <div className="flex flex-col lg:gap-4">
            <p className="text-gray-400"> Welcome to Readit</p>
            <h2 className="font-bold text-gray-800 text-3xl">
              We give you the best articles yout want.
            </h2>
            <p className="text-gray-400 mt-4">
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
