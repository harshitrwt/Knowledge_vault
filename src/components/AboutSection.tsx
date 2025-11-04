"use client";

export default function AboutSection() {
  return (
    <section className="relative bg-[#0A0A15] text-white py-32 overflow-hidden md:h-full h-[110vh]">
      {/* Grid Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(180deg, rgba(55,55,75,0.18) 0px, rgba(55,55,75,0.18) 1px, transparent 1px, transparent 64px)",
        }}
      />

      {/* Accent Glows */}
      <div className="absolute w-[600px] h-[600px] bg-black rounded-full blur-[200px] top-[-100px] left-[-160px]" />
      <div className="absolute w-[500px] h-[500px] bg-black rounded-full blur-[180px] bottom-[-120px] right-[-120px]" />

      <div className="container mx-auto px-8 md:px-20 text-center relative z-10 max-w-7xl">
        {/* Heading */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8">
          Vault
        </h2>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-20">
          Smart Contract Vault redefines blockchain knowledge discovery through adaptive intelligence, ensuring your documents evolve as your ecosystem grows.
        </p>

        {/* Floating Card with Image and Text */}
        <div className="relative grid md:grid-cols-2 gap-12 items-center perspective-[1000px]">
          {/* Left - Floating Image */}
          <div
            className="relative border border-gray-600/70 rounded-3xl bg-[#14161e]/60 shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden transform transition-transform duration-700 hover:rotateY-6 hover:-rotateX-3"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(0deg)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotateY(6deg) rotateX(3deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
            }}
          >
            <img
              src="https://placedog.net/600/400"
              alt="About Smart Contract Vault"
              className="rounded-3xl object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A15]/80 via-transparent to-transparent" />
          </div>

          {/* Right - Description */}
          <div className="flex flex-col justify-center text-left md:pl-10 space-y-6">
            <h3 className="text-3xl font-semibold text-gray-100">
              Not Just Storage — Evolution
            </h3>
            <p className="text-gray-400 leading-relaxed">
              The Vault learns as your organization grows. It connects context, builds associations, and transforms raw blockchain data into living, intelligent archives.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Designed around privacy, precision, and progress, it brings the future of decentralized knowledge into your hands — effortlessly and beautifully.
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Divider */}
      <div className="absolute bottom-0 w-full flex justify-center mt-20">
        <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20"></div>
      </div>
    </section>
  );
}
