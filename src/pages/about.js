import CardAbout from "@/components/cards/CardAbout";
import CardHappyClient from "@/components/cards/cardAbout/CardHappyClient";
import CardTitleAbout from "@/components/cards/cardAbout/CardTitleAbout";
import PaginationAbout from "@/components/cards/cardAbout/PaginationAbout";
import Layout from "@/layout/Layout";
import HeroAll from "@/layout/heroAll";
import React from "react";

export default function About() {
  return (
    <Layout>
      <HeroAll title="About" />
      <div className="">
        <CardAbout />
      </div>
      <div className="p-4 sm:px-20 md:px-32 sm:pt-6 pb-20">
        <CardTitleAbout
          title="Testimonial"
          subtitle="Happy Clients"
        />
      </div>
      <CardHappyClient />
      <PaginationAbout />
    </Layout>
  );
}
