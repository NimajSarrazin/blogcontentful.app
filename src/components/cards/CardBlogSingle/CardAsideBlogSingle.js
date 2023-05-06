import CardLastestNews from "@/components/footer/card/CardLastestNews";
import React from "react";
import { BiSearch } from "react-icons/bi";
import CardCategories from "./CardCategories";

export default function CardAsideBlogSingle() {
  return (
    <aside className="w-full lg:w-2/5 pt-8 lg:pt-1 ">
      <form action="">
        <div className="flex items-center relative pb-10">
          <input
            type="text"
            placeholder="Type a keyword and hit enter"
            className="w-full text-sm px-3 py-2 placeholder-gray-400 text-gray-500 rounded-lg border-none ring-2 ring-gray-300"
          />
          <div className="absolute right-1  ">
            <BiSearch className="text-gray-500 w-5 h-5  pointer-events-none" />
          </div>
        </div>
      </form>
      <div className="">
        <h2 className="text-black text-xl font-black">Categories</h2>
        <CardCategories />
        <CardLastestNews
          fntColor="font-black"
          color="text-black"
          title="Recent Blog"
          url_img="/img/image_1.jpg"
          url_img2="/img/image_2.jpg"
        />
      </div>
    </aside>
  );
}
