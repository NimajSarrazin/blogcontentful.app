import CardAbout from "@/components/cards/CardAbout";
import CardHappyClient from "@/components/cards/cardAbout/CardHappyClient";
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
      <div className="py-10">
        <div className="text-center">
          <p className="text-gray-500"> Testimonial</p>
          <h2 className="font-black"> Happy Clients</h2>
        </div>
      </div>
      <CardHappyClient />
    </Layout>
  );
}
