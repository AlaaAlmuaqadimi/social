import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#f0f2f5] flex items-center justify-center px-6 font-sans">
      
      {/* العناصر الزخرفية الخلفية */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#0B2C5A]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0B2C5A]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* الرقم بتصميم هندسي */}
        <h1 className="text-[10rem] md:text-[15rem] font-black leading-none text-[#0B2C5A] opacity-[0.08] select-none absolute left-1/2 -top-20 -translate-x-1/2">
          404
        </h1>

        <div className="space-y-8 pt-12">
          {/* أيقونة تعبيرية */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 mb-4 border border-gray-100">
             <i className="fa-solid fa-link-slash text-3xl text-[#0B2C5A]"></i>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-black text-[#0B2C5A] tracking-tight">
              Page Not Found
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              The link you followed may be broken, or the page may have been removed. 
            </p>
          </div>

          <div className="flex items-center justify-center pt-6">
            <Link
              to="/"
              className="px-10 py-4 bg-[#0B2C5A] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#1a3d6d] hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              Return to Feed
            </Link>
          </div>

          {/* روابط سريعة */}
          <div className="flex items-center justify-center gap-6 pt-8 border-t border-gray-200 mt-12">
             <Link to="/Profile" className="text-sm font-semibold text-gray-400 hover:text-[#0B2C5A] transition-colors">Profile</Link>
             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
             <Link to="/ChangePasswordPage" className="text-sm font-semibold text-gray-400 hover:text-[#0B2C5A] transition-colors">Settings</Link>
          </div>
        </div>
      </div>

      <p className="absolute bottom-10 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        &copy; 2026 SAITY Digital Network
      </p>
    </div>
  );
}