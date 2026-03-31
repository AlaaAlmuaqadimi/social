import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-12">

      <div className="relative z-10 max-w-3xl w-full text-center space-y-10">
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600  animate-pulse-slow select-none">
          404
        </h1>

        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into space.
            Don't worry — even astronauts get lost sometimes!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5  pt-6">
          <Link
            to="/"
            className="group relative inline-flex items-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10">Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
          </Link>

        </div>
      </div>

      <p className="absolute bottom-6 text-sm text-gray-500 opacity-70">
        Lost in space? That's okay — we'll find our way back together
      </p>
    </div>
  );
}