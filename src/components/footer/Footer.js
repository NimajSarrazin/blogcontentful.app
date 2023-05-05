import React from 'react'
import CardReaditIcon from '../cards/CardReaditIcon'
import CardLastestNews from './card/CardLastestNews'
import CardInformation from './card/CardInformation';
import CardQuestions from './card/CardQuestions';

export default function Footer() {
 
  return (
    <footer className="bg-[#222831] text-white py-20">
      <div className="container sm:grid sm:grid-cols-2 sm:justify-between sm:gap-2 lg:grid-cols-4">
        <CardReaditIcon />
        <CardLastestNews
          url_img="/img/image_1.jpg"
          url_img2="/img/image_2.jpg"
        />
        <CardInformation />
        <CardQuestions />
      </div>

      <p className="text-md text-center text-[#BFC0C2]">
        Copyright &#169;2023 All rights reserved | This template is made with ♥︎
        by Sarrazin Benjamin
      </p>
    </footer>
  );
}
