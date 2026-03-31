import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { ClipLoader } from "react-spinners";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // أيقونات العين
import { AuthContext } from '../Context/AuthContext';

const schemaLogin = zod.object({
  email: zod.string().nonempty("البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
  password: zod.string().nonempty("كلمة المرور مطلوبة").min(8, "يجب أن تكون 8 أحرف على الأقل")
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // حالة إظهار الباسورد
  const { resetUserToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schemaLogin),
    mode: "onChange"
  });

  function handleLogin(value) {
    setIsLoading(true);
    axios.post(`https://route-posts.routemisr.com/users/signin`, value)
      .then(res => {
        const token = res.data.token;
        resetUserToken(token);
        localStorage.setItem('Tkn', token);
        
        swal({
          title: "مرحباً بك!",
          text: "تم تسجيل الدخول إلى My Social App بنجاح",
          icon: "success",
          timer: 1500,
          buttons: false
        }).then(() => navigate("/"));
      })
      .catch(err => {
        swal({
          title: "خطأ في الدخول",
          text: err.response?.data?.message || "يرجى التحقق من بيانات الحساب",
          icon: "error",
          button: "محاولة أخرى"
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      
      {/* القسم الأيسر: نموذج الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0B2C5A]">تسجيل الدخول</h2>
            <p className="text-gray-500 mt-2">سعداء برؤيتك مجدداً في My Social App</p>
          </div>

          <div className="flex gap-4">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-2xl hover:bg-gray-50 transition-all font-medium text-gray-600">
              <FcGoogle className="text-xl" /> Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-2xl hover:opacity-90 transition-all font-medium">
              <FaFacebookF className="text-lg" /> Facebook
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-4 text-gray-400 text-xs uppercase">أو تابع عبر البريد</span>
            <div className="w-full border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 text-right" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">البريد الإلكتروني</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all`}
                placeholder="example@mail.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">كلمة المرور</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all pl-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center px-4 text-gray-400 hover:text-[#0B2C5A] transition-colors"
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#0B2C5A] hover:bg-[#082144] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center mt-2"
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "دخول الآن"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link to="/Register" className="text-[#0B2C5A] font-bold hover:underline">سجل مجاناً</Link>
          </p>
        </div>
      </div>

      {/* القسم الأيمن: الهوية البصرية لـ My Social App */}
      <div className="hidden lg:flex w-1/2 bg-[#0B2C5A] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full border-[40px] border-white"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 border-[2px] border-white rotate-45"></div>
        </div>
        
        <div className="relative z-10 text-center px-16">
          <h1 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase">My Social <br/> App</h1>
          <div className="h-1.5 w-20 bg-blue-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-blue-100 text-xl font-light leading-relaxed">
            مكانك المفضل للتواصل مع الأصدقاء <br /> ومشاركة لحظاتك اليومية.
          </p>
        </div>
      </div>

    </div>
  )
}