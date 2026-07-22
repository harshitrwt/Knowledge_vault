import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="loader" aria-label="Loading">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <style jsx>{`
        .loader {
          display: grid;
          grid-template-columns: repeat(3, 10px);
          gap: 8px;
          align-items: center;
          justify-content: center;
          min-height: 40px;
        }

        .loader span {
          height: 10px;
          width: 10px;
          border-radius: 3px;
          background: var(--vault-brand);
          animation: pulse 780ms ease-in-out infinite;
        }

        .loader span:nth-child(2) {
          background: var(--vault-accent);
          animation-delay: 120ms;
        }

        .loader span:nth-child(3) {
          background: var(--vault-info);
          animation-delay: 240ms;
        }

        @keyframes pulse {
          0% {
            opacity: 0.35;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-8px);
          }
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
