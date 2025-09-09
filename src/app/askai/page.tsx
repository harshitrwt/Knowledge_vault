'use client'
import Sidebar from "@/components/Sidebar";

export default function AskAi() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Ask AI</h1>
        <p className="text-lg text-gray-400 mb-6 text-center">
          This is a placeholder for your AI assistant page.
        </p>
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-black text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}