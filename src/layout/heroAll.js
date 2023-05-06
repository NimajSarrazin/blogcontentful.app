import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function HeroAll({ title }) {
  const router = useRouter();
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
              <h1 className="text-5xl text-white font-bold md:text-6xl lg:text-7xl xl:text-9xl xl:mb-10">
                {title}
              </h1>
              <div className="flex justify-center mt-3 text-md ">
                <Link href="/">
                  <span
                    className={`text-white flex justify-center items-center font-light ${
                      router.pathname === "/" ? "active " : ""
                    }`}
                  >
                    Home
                    <svg
                      className="text-white"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
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
                </Link>
                {/* enpeche la redirection vers la même page depuis le fils d'ariane sur la page about */}
                <Link
                  href="/about"
                  className={`${
                    router.pathname === "/about" ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.pathname !== "/about" && router.push("/about");
                  }}
                >
                  <span
                    className={`text-white flex justify-center items-center font-light ${
                      router.pathname === "/about" ? "active opacity-30" : ""
                    }`}
                  >
                    About
                    <svg
                      className="text-white"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
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
                </Link>
                {/* enpeche la redirection vers la même page depuis le fils d'ariane sur la page about */}
                <Link
                  href="/contact"
                  className={`${
                    router.pathname === "/contact" ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.pathname !== "/contact" && router.push("/contact");
                  }}
                >
                  <span
                    className={`text-white flex justify-center items-center font-light ${
                      router.pathname === "/contact" ? "active opacity-40" : ""
                    }`}
                  >
                    contact
                    <svg
                      className="text-white"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
