import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="neu-inset-deep flex items-center justify-center gap-3 rounded-full p-4">
        <div className="loader flex items-center gap-2" aria-label="Loading">
          <span className="h-3 w-3 rounded-full bg-[#6C63FF] shadow-[0_0_10px_rgba(108,99,255,0.5)]"></span>
          <span className="h-3 w-3 rounded-full bg-[#8B84FF] shadow-[0_0_10px_rgba(139,132,255,0.5)]"></span>
          <span className="h-3 w-3 rounded-full bg-[#38B2AC] shadow-[0_0_10px_rgba(56,178,172,0.5)]"></span>
        </div>
      </div>

      <style jsx>{`
        .loader span {
          animation: pulse 800ms ease-in-out infinite alternate;
        }

        .loader span:nth-child(2) {
          animation-delay: 150ms;
        }

        .loader span:nth-child(3) {
          animation-delay: 300ms;
        }

        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
