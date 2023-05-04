import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="text-white">
      <ul className="flex justify-around gap-8 mx-auto bg-gradient-to-r from-[#f762E4] via-[#F38488] to-[#FAAD85] p-5">
        <li className="font-black text-xl">
          <Link href='/'>
            Read<span className="text-yellow-200">it.</span>
          </Link>
        </li>
        <ul className="flex gap-3">
          <Link href="/">
            <li>Home</li>
          </Link>
          <Link href="/about">
            <li>Articles</li>
          </Link>
          <Link href="/contact">
            <li>Team</li>
          </Link>
          <Link href="/post/1">
            <li>Contact</li>
          </Link>
        </ul>
      </ul>
    </div>
  );
}
