"use client";

export default function HowItWorks() {
  const steps = [
    {
      title: "Upload",
      desc: "Add your smart contracts, docs, or notes to your vault in seconds.",
      img: "https://placedog.net/500/300?id=1",
    },
    {
      title: "Organize",
      desc: "Files are neatly stored and structured for quick access.",
      img: "https://placedog.net/500/300?id=2",
    },
    {
      title: "Search & Share",
      desc: "Find contracts instantly and share them with your team securely.",
      img: "https://placedog.net/500/300?id=3",
    },
  ];

  return (
    <section className="relative bg-[#0A0A0A] py-24 text-white font-nunito">
      <div className="max-w-6xl mx-auto px-8 md:px-20 lg:px-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-500 mb-16">
          How It Works
        </h2>
        <div className="relative flex justify-center items-center gap-6 md:gap-12">
          {steps.map((step, idx) => {
            // Determine styles for curvy layout
            const isCenter = idx === 1; // middle item
            const baseSize = isCenter ? 80 : 60; // image width in %
            const translateX = isCenter
              ? 0
              : idx === 0
              ? "-12%"
              : "12%"; // left smaller image to left and right one to right
            const translateY = isCenter ? "0%" : "10%"; // curve downward for edges

            return (
              <div
                key={idx}
                style={{
                  transform: `translate(${translateX}, ${translateY})`,
                  width: `${baseSize}%`,
                  transition: "transform 0.5s ease",
                }}
                className="flex flex-col items-center bg-gradient-to-tr from-blue-900/40 to-blue-800/30 border border-blue-600 rounded-2xl 
                  shadow-lg p-5 hover:shadow-xl hover:from-blue-800/60 hover:to-blue-700/50 transition cursor-pointer"
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="rounded-xl mb-6 object-cover w-full aspect-[4/3] border border-blue-500 shadow-md"
                />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
