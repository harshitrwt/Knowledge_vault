const Features = () => {
  return (
   <section className="relative bg-black py-20 text-white font-nunito">
  <div className="container mx-auto px-8 md:px-20 flex flex-col md:flex-row max-w-7xl md:mt-22 mt-10 items-center gap-16">
    
  
    <div className="flex-1 text-center md:text-left">
      <h2 className="md:text-5xl text-2xl font-bold text-blue-500 mb-6">
        Why Use Vault?
      </h2>
      <p className="text-gray-300 mb-6 max-w-lg text-2xl">
        Stop wasting hours digging through files and repos. With our vault, you can
        store, search, and share smart contract knowledge instantly.
      </p>

      <ul className="space-y-5">
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300 text-xl">AI-powered semantic search to find knowledge in seconds.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300 text-xl">Organized storage to keep everything in one place.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-blue-400 text-xl">➤</span>
          <span className="text-gray-300 text-xl">Team collaboration with instant sharing & permissions.</span>
        </li>
      </ul>
    </div>

    
    <div className="flex-1 relative flex justify-center items-center">
      
      <div className="absolute w-[320px] h-[320px] border-2 border-blue-500 rotate-6"></div>
      <div className="absolute w-[320px] h-[320px] border-2 border-blue-500 -rotate-6"></div>

      
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFVT1MJAYGjsQQ1zjiuOZ3JhHlLlARGsv2K0O7UVFt4QAL6APHGpFt0xoAAAJNaYiZlWA&usqp=CAU"
        alt="Vault Illustration"
        className="w-[280px] relative z-10 rounded-lg shadow-lg rotate-3"
      />
    </div>
  </div>
</section>



)}

export default Features;