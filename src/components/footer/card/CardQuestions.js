import React from "react";

export default function CardQuestions() {
  return (
    <div className=" md:w-1/2 lg:w-1/4">
      <h2 className="mb-10 text-xl font-normal"> Have a Questions?</h2>
      <div className="p-0">
        <ul className="">
          <li className="flex mb-4 gap-5">
            <span className="pt-[2px]">
              <svg
                className="text-lg"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 384 512"
                height="1em"
                width="40px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
              </svg>
            </span>
            <span className="text-gray-400 text-sm">
              203 Fake St. Mountain View, San Francisco, California, USA
            </span>
          </li>
          <li className="flex mb-4 gap-5">
            <span className="pt-[2px]">
              <svg
                className="text-lg"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="40px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
              </svg>
            </span>
            <span className="text-gray-400 text-sm">+2 392 3929 210</span>
          </li>
          <li className="flex mb-4 gap-5">
            <span className="pt-[2px]">
              <svg
                className="text-lg"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="40px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M437.332 80H74.668C51.199 80 32 99.198 32 122.667v266.666C32 412.802 51.199 432 74.668 432h362.664C460.801 432 480 412.802 480 389.333V122.667C480 99.198 460.801 80 437.332 80zM432 170.667L256 288 80 170.667V128l176 117.333L432 128v42.667z"></path>
              </svg>
            </span>
            <span className="text-gray-400 text-sm">info@yourdomain.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
