import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const navStyleScrolling = "";

  const handleClick = () => {
    setShowModal(true);
  };
  const handleLinkClick = () => {
    setShowModal(false);
  };
  // ajout d'un useState scrool
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`bg-black text-white list-none absolute top-0 left-0 right-0 z-10 md:bg-transparent ${
        scrolled ? "floating" : navStyleScrolling
      }`}
    >
      <div className="container flex justify-between ">
        <Link href="/">
          <div className="flex items-center justify-between h-16">
            <li className="font-black text-2xl">
              Read<span className="text-yellow-200">it</span>.
            </li>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={handleClick}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                aria-label="Main menu"
                aria-expanded="false"
              >
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                MENU
              </button>
            </div>
          </div>
        </Link>
        <ul className="flex items-center justify-between">
          <div className="hidden md:block">
            <div className="ml-10 flex gap-5">
              <Link href="/" onClick={handleLinkClick}>
                <li className="hover:bg-gray-700 rounded-md text-sm font-medium">
                  Home
                </li>
              </Link>
              <Link href="/about" onClick={handleLinkClick}>
                <li className="hover:bg-gray-700  rounded-md text-sm font-medium">
                  About
                </li>
              </Link>
              <Link href="/contact" onClick={handleLinkClick}>
                <li className="hover:bg-gray-700 rounded-md text-sm font-medium">
                  Contact
                </li>
              </Link>
            </div>
          </div>
        </ul>
      </div>
      <div
        className={`${
          showModal ? "block" : "hidden"
        } md:hidden bg-black px-2 pt-2 pb-3`}
      >
        <Link href="/">
          <li className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
            Home
          </li>
        </Link>
      </div>
    </div>
  );
}
