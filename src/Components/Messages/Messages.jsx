import { FaTools } from "react-icons/fa";

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500">Your communication hub</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                Under Development
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white/90 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
          <FaTools className="text-blue-500 text-5xl mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Messages Page In Progress</h2>
          <p className="text-gray-500 text-center mb-6">
            We’re working hard to bring you a seamless messaging experience.<br />
            Stay tuned for updates!
          </p>
          <div className="w-full mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-blue-700">Development Progress</span>
              <span className="text-xs font-medium text-blue-700">65%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-4">Thank you for your patience!</span>
        </div>
      </section>
    </div>
  );
};

export default Messages;