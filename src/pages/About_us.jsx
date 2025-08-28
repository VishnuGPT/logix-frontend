import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-background py-15 px-6">
      <div className="flex justify-center items-center">
        
        {/* Left Text Section */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-headings">
            Our Story
          </h2>

          <div className="space-y-4 text-lg text-text/80 max-w-2xl leading-relaxed">
            <p>
              LogiXJunction is redefining how freight moves across India. In a
              sector often burdened by inefficiencies, delays, and lack of
              transparency, we provide a technology-first platform that
              simplifies logistics for both shippers and transporters.
            </p>

            <p>
              Our mission is to create a smarter, faster, and more reliable
              freight ecosystem, where businesses can ship goods without hassles
              and carriers can grow through steady demand and fair opportunities.
            </p>

            <p>
              Behind LogiXJunction is a diverse and dynamic team of engineers,
              designers, and operations experts working together to solve real
              logistics challenges. We combine data-driven insights, advanced
              digital tools, and industry expertise to ensure efficiency, trust,
              and scalability in freight operations.
            </p>

            <p>
              What makes us unique is our customer-first approach. For shippers,
              we deliver visibility, cost optimization, and reliable deliveries.
              For carriers, we ensure transparent pricing, consistent business,
              and secure payments.
            </p>

            <p>
              Driven by our core values of innovation, reliability, and
              collaboration, we aim to modernize logistics in India and set new
              benchmarks for how freight should move in the 21st century.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
