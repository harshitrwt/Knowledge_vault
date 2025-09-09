const Features = () => {
  return (
   <section className="relative bg-black py-20 text-white">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
    
    {/* Left: Text Content */}
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-6">
        Why Use Smart Contract Vault?
      </h2>
      <p className="text-gray-300 mb-6">
        Stop wasting hours digging through files and repos. With our vault, you can
        store, search, and share smart contract knowledge instantly.
      </p>

      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300">AI-powered semantic search to find knowledge in seconds.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300">Organized storage to keep everything in one place.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300">Team collaboration with instant sharing & permissions.</span>
        </li>
      </ul>
    </div>

    {/* Right: Image */}
    <div className="flex-1 relative">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" 
        alt="Vault Illustration"
        className="w-full max-w-sm mx-auto drop-shadow-lg"
      />

      {/* White Arrow SVG */}
      <div className="absolute -bottom-10 -left-6">
        <svg width="120" height="120" viewBox="0 0 200 200" className="text-white">
          <path
            d="M20,150 C60,100 120,80 180,40"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</section>


)}

export default Features;