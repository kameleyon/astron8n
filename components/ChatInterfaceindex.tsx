"use client";

export default function ChatInterfaceindex() {
  return (
    <div className="chat-container bg-white/50 border border-white/80 shadow-md shadow-black mt-16 mb-8 h-[600px] w-full flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-gray-800">Chat with AstroGenie</h2>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 relative">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl max-w-[80%] bg-[#FFF3E0] text-gray-800">
              Welcome to AstroGenie! Sign in to start your journey into astrology and self-discovery.
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 pt-2 bg-white/1 rounded-lg border-t border-white/20">
        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Sign in to start chatting..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-sm md:text-base"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
