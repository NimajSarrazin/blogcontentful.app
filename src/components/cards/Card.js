import Link from "next/link";
import React from "react";

export default function Card({ img, title, extract, slug }) {
  return (
    <Link href={`post/${slug}`}>
      <div className="">
        <img src={img} alt={title} className="max-w-xs" />
        <p className="font-bold">{title}</p>
        <p className="max-w-xs text-left">{extract}</p>
      </div>
    </Link>
  );
}
