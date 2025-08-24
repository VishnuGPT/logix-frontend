import React, { useEffect, useRef, useState } from "react";

function useCountUp(target, duration, trigger) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const end = target;
    const increment = (end - start) / (duration / 16); // ~60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Number(current.toFixed(1))); // supports decimals
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fleetOwners = useCountUp(500, 2000, inView); // 2s animation
  const states = useCountUp(15, 2000, inView);
  const rating = useCountUp(4.8, 2000, inView);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen snap-start bg-lxj-softWhite text-gray-900 px-6 py-40 space-y-24"
    >
      {/* Section Container */}
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-zinc-200">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Ravi Verma</h3>
                <p className="text-sm text-gray-500">Transporter (Lucknow)</p>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              “With LogiXjunction, I receive more consistent loads and faster
              payments. No more endless calls!”
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-zinc-200">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Ankita Sharma
                </h3>
                <p className="text-sm text-gray-500">Shipper (Indore)</p>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              “Their tracking system and route planning saved us 15% in logistics
              costs in 3 months!”
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center border border-zinc-200">
            <h2 className="text-3xl font-extrabold text-lxj-alert mb-2">
              {Math.floor(fleetOwners)}+
            </h2>
            <p className="font-semibold text-lxj-accent">
              Trusted by Fleet Owners
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Reliable partnerships across India’s logistics ecosystem.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center border border-zinc-200">
            <h2 className="text-3xl font-extrabold text-lxj-alert mb-2">
              {Math.floor(states)} States
            </h2>
            <p className="font-semibold text-lxj-accent">Shipper Coverage</p>
            <p className="text-sm text-gray-500 mt-2">
              Pan-India presence with smart regional matching.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center  border border-zinc-200">
            <h2 className="text-3xl text-lxj-alert font-extrabold mb-2">
              {rating.toFixed(1)}
              <span className="text-yellow-400">★</span>
            </h2>
            <p className="font-semibold text-lxj-accent">Platform Rating</p>
            <p className="text-sm text-gray-500 mt-2">
              Based on verified user feedback from transporters & shippers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
