import Link from "next/link";
import React from "react";

export default function Card({ img, title, extract, slug }) {
  return (
    <Link href={`post/${slug}`}>
      <div className="py-10">
        <div className="relative">
          <img
            src={img}
            alt={title}
            className="object-cover w-full h-48 sm:h-72 md:h-64 lg:h-72 xl:h-[32rem]"
          />
          <div className="absolute bottom-0 left-3 group-hover:block">
            <div className="bg-yellow-400 flex gap-1.5 text-black text-sm rounded-sm py-1 px-2 max-w-xs relative">
              <p className="text-center text-3xl font-medium">18</p>
              <p className="text-xs">
                2019
                <br />
                october
              </p>
              <div className="absolute h-3 w-3 left-1/3 transform -translate-x-1/2 top-full -mt-2">
                <div className="absolute h-full w-full bg-yellow-400 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 font-bold text-lg">{title}</p>
        <p className="mt-2 text-sm md:text-base">{extract}</p>
      </div>
    </Link>
  );
}
