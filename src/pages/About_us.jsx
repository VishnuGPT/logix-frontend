import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

        {/* Left Text Section */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings">
            Meet Our Team
          </h2>
          <p className="text-lg text-text/80 max-w-xl">
            LogiXJunction is redefining how freight moves across India. In a sector often burdened by
            inefficiencies, delays, and lack of transparency, we provide a technology-first platform that
            simplifies logistics for both shippers and transporters.
          </p>
          <p className="text-lg text-text/80 max-w-xl">
            Our mission is to create a smarter, faster, and more reliable freight ecosystem, where
            businesses can ship goods without hassles and carriers can grow through steady demand and
            fair opportunities.
          </p>
        </div>

        {/* Right Placeholder Section */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-md h-64 bg-gradient-to-r from-interactive to-indigo-500 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            Our Team Placeholder
          </div>
        </div>

      </div>
    </section>
  );
}
