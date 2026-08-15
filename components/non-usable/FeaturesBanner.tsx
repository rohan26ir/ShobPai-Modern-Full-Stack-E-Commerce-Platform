"use client";

import { FaTruck, FaLeaf, FaShieldAlt, FaHeadset } from "react-icons/fa";

import Image from "next/image";
import imageService from '@/public/sections/exquisite-service.webp'

export default function FeaturesBanner() {
  

  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">

        <div className=" text-center py-10">
          <h2>Exquisite Service</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-center ">
          
          
          {/* 1st */}
          <div className="flex flex-col gap-2 justify-between h-full">
          <div className="flex gap-2 items-center ">
            <div className=" rounded-full border">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" className="text-xl h-25 w-25 p-8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </div>
            <div>
              <h3>Quality support</h3>
              <p>Alway online 24/7</p>
            </div>
          </div>
          {/* 1st */}
          <div className="flex gap-2 items-end ">
            <div className=" rounded-full border">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" className="text-xl h-25 w-25 p-8"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h3>Free delivary</h3>
              <p>Orders from all Item</p>
            </div>
          </div>
          </div>

          {/* 2nd image */}
          <div className="px-5">
            <Image src={imageService} alt="imageService" />
          </div>

          {/* 3rd */}
          <div className="flex flex-col gap-2 justify-between h-full lg:ml-28">
          <div className="flex gap-2 items-end ">
            <div className=" rounded-full border">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" className="text-xl h-25 w-25 p-8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div>
              <h3>Join newslleter</h3>
              <p>20% off by subscribing</p>
            </div>
          </div>
          {/* 1st */}
          <div className="flex gap-2 items-end ">
            <div className=" rounded-full border">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" className="text-xl h-25 w-25 p-8"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </div>
            <div>
              <h3>Return & refund</h3>
              <p>Money back guarantee</p>
            </div>
          </div>
          </div>


        </div>


      </div>
    </section>
  );
}
