
const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
    
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500">Your communication hub</p>
            </div>

           
            <div className="hidden sm:flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </header>

    </div>
  );
};

export default Messages;
