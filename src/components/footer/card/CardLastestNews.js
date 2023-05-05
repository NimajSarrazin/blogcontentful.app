import React from "react";
import CardInformation from "./CardInformation";
import CardQuestions from "./CardQuestions";
import CardCopyright from "./CardCopyright";

export default function CardLastestNews({ url_img, url_img2 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="w-full md:w-1/2 lg:w-2/3">
        <h2 className="text-white mb-10 text-xl font-normal">latest News</h2>
        <div className="flex flex-col md:flex-row mb-4">
          <span
            className="block h-20 w-20 bg-cover bg-center bg-no-repeat rounded-md mr-6"
            style={{ backgroundImage: `url(${url_img})` }}
          ></span>
          <div className="w-full md:w-[calc(100%-100px)]">
            <p className="text-base font-normal text-gray-400">
              Even the all-powerful Pointing has no control about
            </p>
            <div className="flex text-gray-700 text-xs space-x-4">
              <p> Oct. 16, 2019</p>
              <p> Admin</p>
              <p> 19</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mb-4">
          <span
            className="block h-20 w-20 bg-cover bg-center bg-no-repeat rounded-md mr-6"
            style={{ backgroundImage: `url(${url_img2})` }}
          ></span>
          <div className="w-full md:w-[calc(100%-100px)]">
            <p className="text-base font-normal text-gray-400">
              Even the all-powerful Pointing has no control about
            </p>
            <div className="flex text-gray-700 text-xs space-x-4">
              <p> Oct. 16, 2019</p>
              <p> Admin</p>
              <p> 19</p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <CardInformation />
          <CardQuestions />
      </div>
        <div className="">
          {/* <CardCopyright /> */}
        </div>
    </div>
  );
}
