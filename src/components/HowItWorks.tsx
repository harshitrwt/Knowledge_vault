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
    <section
      className= "relative bg-[#0A0A0A] py-24 text-white font-nunito"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-20 lg:px-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-500 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 border border-blue-800 rounded-xl bg-blue-950/20 hover:bg-blue-950/30 transition"
            >
              <img
                src={step.img}
                alt={step.title}
                className="rounded-lg mb-6 w-full h-48 object-cover border border-blue-500"
              />
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
