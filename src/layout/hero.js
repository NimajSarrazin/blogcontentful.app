import React from "react";

export default function Hero({ bgColor, title, content, url_img }) {
  const bgStyle = `${bgColor}`;
  // const bgImage = "bg-[url('/public/img/bg_1.jpg)]";
  return (
    <section className="">
      <div className={`${bgStyle} bg-center bg-cover hero_bg`}></div>
      <img className="" src={`img/${url_img}`} alt="" />
      <h1>{title}</h1>
      <p>{content}</p>
    </section>
  );
}
