"use client";

const Features = () => {
  const features = [
    {
      title: "Hyper-Intelligent Retrieval",
      desc: "Extract accurate insights from complex documents instantly, powered by adaptive AI cognition.",
      icon: "⚙️",
    },
    {
      title: "Secure Knowledge Architecture",
      desc: "Enterprise-grade encryption ensures your knowledge stays safe, synchronized, and private.",
      icon: "🔐",
    },
    {
      title: "Collaborative Intelligence",
      desc: "Real-time team access with layered permissions, fostering clarity and shared understanding.",
      icon: "🤝",
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-12 text-white bg-[#0A0A15] flex flex-col justify-center items-center overflow-hidden">
      {/* Embedded Grid Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      ></div>

      {/* Accent Glows */}
      <div className="absolute w-[600px] h-[600px] bg-black rounded-full blur-[200px] top-[-100px] left-[-160px]" />
      <div className="absolute w-[500px] h-[500px] bg-black rounded-full blur-[180px] bottom-[-120px] right-[-120px]" />

      {/* Header Text */}
      <div className="relative z-10 text-center max-w-3xl mb-20">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Intelligent Features
        </h2>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Unlock the next era of intelligent document processing with precise reasoning,
          contextual awareness, and seamless collaboration built for scale.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl w-full relative z-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border border-gray-700/50 bg-[#10121a]/70 hover:bg-[#151827]/80 transition-all duration-300 rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]"
          >
            <div className="text-5xl mb-6">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 w-full flex justify-center mt-20">
        <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-20"></div>
      </div>
    </section>
  );
};

export default Features;
