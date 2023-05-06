import Link from "next/link";
import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

export default function CardIcon({ }) {
  return (
    <div className="flex items-center space-x-3 uppercase text-gray-400 hover:text-black">
      <HiArrowNarrowRight className="text-xs" />
      <p className="text-xs">read more</p>
    </div>
  );
}
