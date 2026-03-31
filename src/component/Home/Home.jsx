import { useContext } from 'react'
import axios from "axios";
import { AuthContext } from '../Context/AuthContext'
import PostCard from '../PostCard/PostCard';
import { ClipLoader } from "react-spinners";
import { useQuery } from '@tanstack/react-query';
import PostCreation from '../PostCreate/PostCreate';
import { Link } from 'react-router-dom';

export default function Home() {
  const { userToken } = useContext(AuthContext);

  // دالة جلب المنشورات بتنسيق Headers الصحيح
  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        token: userToken 
      }
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPost', userToken],
    queryFn: getAllPosts,
    refetchOnMount: false,
    enabled: !!userToken,
  });

  // استخراج المصفوفة بشكل صحيح
  const allPosts = data?.data?.posts || [];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader size={50} color="#0B2C5A" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-red-600 font-bold">خطأ في تحميل المنشورات.. يرجى المحاولة لاحقاً</h2>
      </div>
    );
  }

  return (
    <>
      <div className='flex gap-5 px-6 bg-gray-50 min-h-screen'>
        
        {/* القسم الأيسر - القائمة الجانبية */}
        <div className='w-1/4 hidden lg:block'>
          <div className='w-10/12 rounded-3xl m-auto my-8 bg-[#0B2C5A] text-white shadow-lg overflow-hidden'>
            <div className="p-4 border-b border-white/10 text-center font-bold text-lg">
              SAITY Social
            </div>
            
            <Link to="/Profile" className="flex items-center gap-3 hover:bg-[#1a3d6d] px-6 py-4 transition cursor-pointer">
              <i className="fa-regular fa-star text-yellow-400"></i>
              <span className="font-medium">Profile</span>
            </Link>

            <Link to="/" className="flex items-center gap-3 hover:bg-[#1a3d6d] px-6 py-4 transition cursor-pointer">
              <i className="fa-solid fa-earth-americas text-blue-300"></i>
              <span className="font-medium">Community</span>
            </Link>

            <Link to="/ChangePasswordPage" className="flex items-center gap-3 hover:bg-[#1a3d6d] px-6 py-4 transition cursor-pointer">
              <i className="fa-solid fa-gear text-gray-300"></i>
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>

        {/* القسم الأوسط - التغذية الإخبارية */}
        <div className='flex flex-col gap-7 w-full lg:w-1/2 my-6'>
          <PostCreation />
          
          {allPosts.map(post => (
            <PostCard key={post._id} postInfo={post} queryKey={['getPost']} />
          ))}
        </div>

        {/* القسم الأيمن - المقترحات */}
        <div className='w-1/4 hidden lg:block'>
          <div className="my-6 p-2">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-user-group text-[#0B2C5A]"></i>
                  <h2 className="font-bold text-gray-800">Suggested</h2>
                </div>
                <span className="bg-blue-50 text-[#0B2C5A] text-xs font-bold px-2 py-1 rounded-full">
                  5
                </span>
              </div>

              {/* حقل البحث */}
              <div className="mb-6">
                <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#0B2C5A] transition">
                  <i className="fa-solid fa-magnifying-glass text-gray-400 mr-2"></i>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="bg-transparent outline-none w-full text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* قائمة الأصدقاء المقترحين */}
              {[1].map((item) => (
                <div key={item} className="border border-gray-100 rounded-2xl p-4 mb-3 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0B2C5A] flex items-center justify-center text-white font-bold text-sm">
                        M
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">Mohamed</h3>
                        <p className="text-gray-400 text-[10px]">Route User</p>
                      </div>
                    </div>

                    <button className="flex items-center gap-1 bg-[#0B2C5A] text-white px-3 py-1.5 rounded-full text-[10px] hover:bg-[#1a3d6d] transition">
                      <i className="fa-solid fa-user-plus"></i>
                      Follow
                    </button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-md">
                      19 followers
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-md">
                      1 mutual
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}