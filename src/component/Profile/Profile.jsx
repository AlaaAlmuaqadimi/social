import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import PostCreation from '../PostCreate/PostCreate';
import { Card, CardBody, Divider, Chip, Avatar } from "@heroui/react";
import { HiOutlineMail, HiOutlineCake, HiOutlineUserCircle } from "react-icons/hi";

export default function Profile() {
  const { userToken } = useContext(AuthContext);

  function userProfile() {
    return axios.get(
      `https://route-posts.routemisr.com/users/profile-data`,
      {
        headers: {
          token: userToken // تم التعديل ليتوافق مع الـ API الخاص بك
        }
      }
    );
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userProfile,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <ClipLoader size={40} color="#0B2C5A" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-gray-500 font-bold">Error loading profile data.</div>;
  }

  const user = data?.data?.data;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12">
      {/* الغلاف العلوي - تصميم هندسي بسيط */}
      <div className="h-64 w-full bg-[#0B2C5A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute transform rotate-45 bg-white w-96 h-96 -top-20 -left-20"></div>
            <div className="absolute transform rotate-45 bg-white w-64 h-64 bottom-0 right-10"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* بطاقة معلومات الحساب */}
        <Card className="rounded-[2.5rem] shadow-2xl shadow-blue-900/5 -mt-24 border-none">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* الصورة الشخصية */}
              <Avatar
                src={user.user?.photo}
                className="w-32 h-32 text-large rounded-[2rem] border-4 border-white shadow-xl"
              />

              {/* المعلومات الأساسية */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-[#0B2C5A] tracking-tight">
                    {user.user?.name}
                  </h2>
                  <Chip size="sm" variant="flat" className="bg-blue-50 text-[#0B2C5A] font-bold">
                    @{user.user?.username}
                  </Chip>
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  Member since {new Date(user.user?.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* الإحصائيات - تصميم Minimalist */}
              <div className="flex gap-2 bg-gray-50 p-2 rounded-[2rem]">
                {[
                  { label: "Followers", value: user.user?.followers.length },
                  { label: "Following", value: user.user?.following.length },
                  { label: "Bookmarks", value: user.user?.bookmarks.length }
                ].map((stat, i) => (
                  <div key={i} className="px-6 py-3 text-center bg-white rounded-[1.5rem] shadow-sm border border-gray-100">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</p>
                    <p className="text-xl font-black text-[#0B2C5A]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Divider className="my-8 opacity-50" />

            {/* تفاصيل الحساب */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-[#0B2C5A] font-black text-lg flex items-center gap-2">
                  <HiOutlineUserCircle /> General Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem icon={<HiOutlineMail className="text-blue-500" />} label="Email Address" value={user.user?.email} />
                  <InfoItem icon={<HiOutlineCake className="text-pink-500" />} label="Birth Date" value={user.user?.dateOfBirth || "Not Set"} />
                  <InfoItem icon={<HiOutlineUserCircle className="text-green-500" />} label="Gender" value={user.user?.gender} />
                </div>
              </div>

              {/* بطاقة جانبية للمنشورات */}
              <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">Activity Summary</span>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Posts</span>
                        <span className="font-bold text-[#0B2C5A]">{user.user?.postsCount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Saved Items</span>
                        <span className="font-bold text-[#0B2C5A]">{user.user?.bookmarks.length}</span>
                    </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* قسم إنشاء المنشورات */}
        <div className="mt-10 max-w-2xl mx-auto">
          <PostCreation />
        </div>
      </div>
    </div>
  );
}

// مكون فرعي لعرض المعلومات بشكل مرتب
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white transition-all group">
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{label}</p>
        <p className="text-sm font-bold text-[#0B2C5A]">{value}</p>
      </div>
    </div>
  );
}