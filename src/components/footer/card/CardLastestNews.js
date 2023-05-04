import React from "react";

export default function CardLastestNews() {
  return (
    <div className="flex flex-wrap">
      <div className="w-[100%]">
        <h2 className="text-white mb-10 text-xl font-normal">latest News</h2>
        <div className="">
          <div className="flex">
            <span
              className="block h-20 w-20 bg-cover bg-center bg-no-repeat rounded-md mr-6"
              style={{ backgroundImage: "url('/img/image_1.jpg')" }}
            ></span>
            <div className="w-[calc(100%-100px)]">
              <p className="text-base font-normal text-gray-400">
                Even the all-powerful Pointing has no control about
              </p>
              <div className="flex text-gray-700 text-xs space-x-4">
                <div className="">
                  <p> Oct. 16, 2019</p>
                </div>
                <div>
                  <p> Admin</p>
                </div>
                <div>
                  <p> 19</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
