import CardContact from "@/components/cards/CardContact";
import Layout from "@/layout/Layout";
import HeroAll from "@/layout/heroAll";
import React from "react";

export default function Contact() {
  return (
    <Layout>
      <HeroAll title="Contact" />
      <div className="container py-20 ">
        <div className="pb-10">
          <h2 className="text-xl pb-10 font-bold text-black">
            Contact Information
          </h2>
          <div className="sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
            <p className="text-gray-500 text-xs">
              Address:
              <span>
                198 West 21th Street, <br /> Suite 721 New York NY 10016
              </span>
            </p>
            <p className="text-gray-500 text-xs">
              Phone: <span className="text-black">+ 1235 2355 98</span>
            </p>
            <p className="text-gray-500 text-xs">
              Email: <span className="text-black">info@yoursite.com</span>
            </p>
            <p className="text-gray-500 text-xs">
              Website <span className="text-black">yoursite.com</span>
            </p>
          </div>
        </div>
        <div className="bg-gray-100 sm:flex md:flex-row-reverse ">
          <CardContact />
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24182.88581760929!2d-74.03266058916016!3d40.74308999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bb65ffb4b7%3A0xfb6f9cef91401b93!2sEvents%20Coverage%20and%20Photography!5e0!3m2!1sfr!2sfr!4v1683425442790!5m2!1sfr!2sfr"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[35vh] sm:h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}
