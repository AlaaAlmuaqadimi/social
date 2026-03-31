import { useContext } from 'react';
import axios from "axios";
import { AuthContext } from '../Context/AuthContext';
import PostCard from '../PostCard/PostCard';
import { ClipLoader } from "react-spinners";
import { useQuery } from '@tanstack/react-query';
import PostCreation from '../PostCreate/PostCreate';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
  const { userToken } = useContext(AuthContext);
  const location = useLocation();

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPost'],
    queryFn: getAllPosts,
    refetchOnMount: false,
  });

  const allPosts = data?.data?.data?.posts || [];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-[#F8FAFC]'>
        <ClipLoader size={50} color="#0B2C5A" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500 font-bold">حدث خطأ أثناء تحميل المنشورات</div>;
  }

  // مكوّن جانبي للروابط (Sidebar Link) لتقليل التكرار
  const SidebarLink = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-200 group ${
        isActive ? 'bg-[#0B2C5A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}>
        <i className={`${icon} ${isActive ? 'text-blue-300' : 'text-gray-400 group-hover:text-[#0B2C5A]'}`}></i>
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className='bg-[#F8FAFC] min-h-screen'>
      <div className='max-w-[1400px] mx-auto flex gap-8 px-4'>
        
        {/* اليسار: القائمة الجانبية (Navigation) */}
        <div className='hidden lg:block w-1/4 py-8 sticky top-0 h-screen'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2'>
            <div className='px-6 py-4 mb-2'>
              <h1 className='text-2xl font-black text-[#0B2C5A] tracking-tighter'>SAITY</h1>
            </div>
            <SidebarLink to="/Profile" icon="fa-regular fa-user" label="الملف الشخصي" />
            <SidebarLink to="/" icon="fa-solid fa-house" label="المجتمع" />
            <SidebarLink to="/ChangePasswordPage" icon="fa-solid fa-gear" label="الإعدادات" />
          </div>
        </div>

        {/* المنتصف: التغذية الإخبارية (Feed) */}
        <div className='flex flex-col gap-6 w-full lg:w-1/2 py-8'>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
             <PostCreation />
          </div>

          <div className='space-y-6'>
            {allPosts.map(post => (
              <PostCard key={post._id} postInfo={post} queryKey={['getPost']} />
            ))}
          </div>
        </div>

        {/* اليمين: الاقتراحات (Suggestions) */}
        <div className='hidden lg:block w-1/4 py-8 sticky top-0 h-screen'>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
               <h2 className="font-bold text-[#0B2C5A] flex items-center gap-2">
                 <i className="fa-solid fa-user-plus text-blue-500"></i>
                 اقتراحات الأصدقاء
               </h2>
               <span className="bg-blue-50 text-[#0B2C5A] text-xs font-bold px-2.5 py-1 rounded-lg">5</span>
            </div>

            <div className="p-4">
              {/* البحث */}
              <div className="relative mb-6">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="بحث عن أشخاص..."
                  className="w-full bg-gray-50 border-none outline-none py-2.5 pl-10 pr-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* قائمة الأصدقاء */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-[#0B2C5A] font-bold">
                      M
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">Mohamed</h3>
                      <p className="text-[11px] text-gray-400">Route User</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#0B2C5A] hover:bg-white rounded-lg shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <i className="fa-solid fa-user-plus"></i>
                  </button>
                </div>
              ))}
              
              <button className="w-full mt-4 py-2 text-sm font-medium text-[#0B2C5A] hover:bg-blue-50 rounded-xl transition-all">
                عرض المزيد
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}