import React, { useState } from "react";

// création du table qui stock mes tab ('Our mission', '')
const tabContents = [
  {
    name: "Our Mission",
    content:
      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts Separated they live in Bookmarkgrave right at the coast of the semantic, a large language ocean.",
  },
  {
    name: "Our Vision",
    content:
      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts Separated they live in Bookmarkgrave right at the coast of the semantic, a large language ocean.",
  },
  {
    name: "Our Values",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque blanditiis exercitationem aut. Atque corrupti deserunt repellendus. Ullam voluptatum blanditiis quisquam atque, officia esse ipsa commodi incidunt assumenda optio nisi dolorum.",
  },
];

export default function CardMission() {
  const [showTab, setShowTab] = useState("Our Mission");
  const styleText = "text-white bg-yellow-500";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col md:flex-row gap-2">
        {tabContents.map((tab) => (
          <div
            key={tab.name}
            className={`flex-grow bg-white shadow-md px-7 py-2 text-center font-bold cursor-pointer md:w-auto border ${
              showTab === tab.name ? styleText : ""
            }`}
            onClick={() => setShowTab(tab.name)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      {/* content text de chaque tab */}
      <div className="bg-slate-200 rounded-sm p-5 px-3 mt-1 ">
        {tabContents.find((tab) => tab.name === showTab)?.content}
      </div>
    </div>
  );
}
