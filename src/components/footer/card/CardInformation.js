import Link from "next/link";
import React from "react";
const dataLiens = [
  {
    name: "Home",
    svg: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "About",
    svg: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Contact",
    svg: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"></path>
        </g>
      </svg>
    ),
  },
];
export default function CardInformation() {
  return (
    <div className="">
      <h6 className="pb-6 text-white text-lg lg:px-14">Information</h6>
      <ul className="text-sm text-white pb-6 lg:px-14">
        {dataLiens.map((lien, index) => (
          <li className="pb-2" key={index}>
            <Link href="/" className="flex pb-2 items-center">
              {lien.svg}
              <p className="pl-2">{lien.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
