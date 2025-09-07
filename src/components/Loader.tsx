import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="boxes">
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes box1 {
          0%, 50% {
            transform: translate(100%, 0);
          }
          100% {
            transform: translate(200%, 0);
          }
        }

        @keyframes box2 {
          0% {
            transform: translate(0, 100%);
          }
          50% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100%, 0);
          }
        }

        @keyframes box3 {
          0%, 50% {
            transform: translate(100%, 100%);
          }
          100% {
            transform: translate(0, 100%);
          }
        }

        @keyframes box4 {
          0% {
            transform: translate(200%, 0);
          }
          50% {
            transform: translate(200%, 100%);
          }
          100% {
            transform: translate(100%, 100%);
          }
        }

        .boxes {
          --size: 32px;
          --duration: 800ms;
          height: calc(var(--size) * 2);
          width: calc(var(--size) * 3);
          position: relative;
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
          margin-top: calc(var(--size) * 1.5 * -1);
          transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
        }

        .boxes .box {
          width: var(--size);
          height: var(--size);
          top: 0;
          left: 0;
          position: absolute;
          transform-style: preserve-3d;
        }

        .boxes .box:nth-child(1) {
          transform: translate(100%, 0);
          animation: box1 var(--duration) linear infinite;
        }

        .boxes .box:nth-child(2) {
          transform: translate(0, 100%);
          animation: box2 var(--duration) linear infinite;
        }

        .boxes .box:nth-child(3) {
          transform: translate(100%, 100%);
          animation: box3 var(--duration) linear infinite;
        }

        .boxes .box:nth-child(4) {
          transform: translate(200%, 0);
          animation: box4 var(--duration) linear infinite;
        }

        .boxes .box > div {
          --background: #5C8DF6;
          --top: auto;
          --right: auto;
          --bottom: auto;
          --left: auto;
          --translateZ: calc(var(--size) / 2);
          --rotateY: 0deg;
          --rotateX: 0deg;
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--background);
          top: var(--top);
          right: var(--right);
          bottom: var(--bottom);
          left: var(--left);
          transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ));
        }

        .boxes .box > div:nth-child(1) {
          --top: 0;
          --left: 0;
        }

        .boxes .box > div:nth-child(2) {
          --background: #145af2;
          --right: 0;
          --rotateY: 90deg;
        }

        .boxes .box > div:nth-child(3) {
          --background: #447cf5;
          --rotateX: -90deg;
        }

        .boxes .box > div:nth-child(4) {
          --background: #DBE3F4;
          --top: 0;
          --left: 0;
          --translateZ: calc(var(--size) * 3 * -1);
        }
      `}</style>
    </div>
  );
};

export default Loader;
