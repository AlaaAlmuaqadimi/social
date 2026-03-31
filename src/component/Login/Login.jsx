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
import { AuthContext } from '../Context/AuthContext';

// تحسين الـ Schema ليكون أكثر مرونة
const schemaLogin = zod.object({
  email: zod.string().nonempty("البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
  password: zod.string().nonempty("كلمة المرور مطلوبة").min(8, "يجب أن تكون 8 أحرف على الأقل")
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
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
        const token = res.data.token; // تأكد من مسار التوكن في الـ API الخاص بك
        resetUserToken(token);
        localStorage.setItem('Tkn', token);
        
        swal({
          title: "تم تسجيل الدخول!",
          text: "مرحباً بك مجدداً في SAITY",
          icon: "success",
          timer: 1500,
          buttons: false
        }).then(() => navigate("/"));
      })
      .catch(err => {
        swal({
          title: "خطأ في الدخول",
          text: err.response?.data?.message || "يرجى التحقق من البيانات",
          icon: "error",
          button: "محاولة أخرى"
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]"> {/* خلفية فاتحة مريحة للعين */}
      
      {/* القسم الأيسر: نموذج الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0B2C5A]">تسجيل الدخول</h2>
            <p className="text-gray-500 mt-2">مرحباً بك في لوحة تحكم SAITY</p>
          </div>

          {/* أزرار التواصل الاجتماعي بهوية احترافية */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium text-gray-600">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 rounded-xl hover:opacity-90 transition-all">
              <FaFacebookF className="text-lg" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-4 text-gray-400 text-xs uppercase tracking-wider">أو عبر البريد</span>
            <div className="w-full border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#0B2C5A] focus:border-transparent outline-none transition-all`}
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#0B2C5A] focus:border-transparent outline-none transition-all`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0B2C5A] hover:bg-[#082144] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center"
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "دخول الأن"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link to="/Register" className="text-[#0B2C5A] font-bold hover:underline">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>

      {/* القسم الأيمن: الهوية البصرية (يظهر في الشاشات الكبيرة) */}
      <div className="hidden lg:flex w-1/2 bg-[#0B2C5A] items-center justify-center relative overflow-hidden">
        {/* خلفية هندسية بسيطة */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full border-[40px] border-white"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 border-[2px] border-white rotate-45"></div>
        </div>
        
        <div className="relative z-10 text-center px-12">
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">SAITY</h1>
          <div className="h-1 w-20 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-blue-100 text-xl font-light leading-relaxed">
            تطوير الحلول الرقمية بدقة هندسية <br /> ومنطق أعمال متكامل.
          </p>
        </div>
      </div>

    </div>
  )
}