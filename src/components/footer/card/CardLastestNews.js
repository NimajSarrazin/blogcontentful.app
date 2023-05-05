import React from "react";

export default function CardLastestNews({ url_img, url_img2 }) {
  return (
    <div className="">
      <h4 className="pb-6 text-white text-xl font-normal">latest News</h4>
      <div className="pb-4 flex items-start">
        <div>
          <div className="flex pb-4 ">
            <span
              className="block h-20 w-20 bg-cover bg-center bg-no-repeat rounded-md mr-6"
              style={{ backgroundImage: `url(${url_img})` }}
            ></span>
            <div className="w-full md:w-[calc(100%-100px)]">
              <p className="text-base font-normal text-gray-400">
                Even the all-powerful Pointing has no control about
              </p>
              <div className="flex text-gray-700 text-xs space-x-2">
                <p> Oct. 16, 2019</p>
                <p> Admin</p>
                <p> 19</p>
              </div>
            </div>
          </div>
          <div className="flex pb-4 ">
            <span
              className="block h-20 w-20 bg-cover bg-center bg-no-repeat rounded-md mr-6"
              style={{ backgroundImage: `url(${url_img2})` }}
            ></span>
            <div className="w-full md:w-[calc(100%-100px)]">
              <p className="text-base font-normal text-gray-400">
                Even the all-powerful Pointing has no control about
              </p>
              <div className="flex text-gray-700 text-xs space-x-2">
                <p> Oct. 16, 2019</p>
                <p> Admin</p>
                <p> 19</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
