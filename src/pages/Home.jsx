import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-softWhite min-h-screen flex flex-col items-center">
      {/* Hero image */}
      <div className="w-full relative">
        <img
          src="/images/truck-banner.jpg" // replace with your truck image path
          alt="Truck on highway"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold drop-shadow-lg">
          About Us
        </h1>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-screen-md mx-auto -mt-6">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-lxj-primary text-center mb-4">
            Who We Are
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            At <span className="font-semibold">LogiXJunction</span>, we serve as
            a technology-first intermediary, offering a digital platform that
            connects businesses and individuals with the right logistics service
            providers.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            We do not provide logistics services directly—instead, we enable
            users to access and manage logistics more efficiently through smart
            tools, real-time data, and streamlined workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
