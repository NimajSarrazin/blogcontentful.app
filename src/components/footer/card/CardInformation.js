import React from "react";
const dataLiens = [
  {
    name: "Home",
    svg: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
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
        stroke-width="0"
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
    name: "Articles",
    svg: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
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
        stroke-width="0"
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
    <div className="mb-6 w-1/4">
      <h2 className="mb-10 text-xl font-normal"> Information</h2>
      <ul className="list-none">
        {dataLiens.map((item, index) => (
          <li key={index} className="py-1">
            <span className="flex items-center">
              {item.svg}
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
