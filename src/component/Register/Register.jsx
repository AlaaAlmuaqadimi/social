import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { ClipLoader } from "react-spinners";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; 

const schema = zod.object({
  name: zod.string().nonempty("الاسم مطلوب").min(3, "يجب أن يكون الاسم 3 أحرف على الأقل"),
  email: zod.string().nonempty("البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
  password: zod.string().nonempty("كلمة المرور مطلوبة").regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, "يجب أن تحتوي على حروف وأرقام و8 رموز"),
  rePassword: zod.string().nonempty("تأكيد كلمة المرور مطلوب"),
  dateOfBirth: zod.coerce.date({ required_error: "تاريخ الميلاد مطلوب" })
    .refine((date) => (new Date().getFullYear() - date.getFullYear()) >= 10, "يجب أن يكون العمر 10 سنوات على الأقل")
    .transform((date) => date.toISOString().split("T")[0]),
  gender: zod.enum(["male", "female"], { errorMap: () => ({ message: "يرجى اختيار الجنس" }) })
}).refine((data) => data.password === data.rePassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["rePassword"]
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: "", email: "", password: "", rePassword: "", dateOfBirth: "", gender: "" },
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  function handleRegister(value) {
    setIsLoading(true);
    axios.post(`https://route-posts.routemisr.com/users/signup`, value)
      .then(() => {
        swal({ title: "نجاح!", text: "تم إنشاء حسابك في My Social App", icon: "success", timer: 2000, buttons: false })
        .then(() => navigate("/")); 
      })
      .catch(err => {
        swal({ title: "خطأ!", text: err.response?.data?.message || "حدث خطأ ما", icon: "error" });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      
      {/* القسم الأيسر: واجهة My Social App */}
      <div className="hidden lg:flex w-1/2 bg-[#0B2C5A] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-5%] left-[-5%] w-80 h-80 rounded-full border-[2px] border-white animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 border-[1px] border-white rotate-12"></div>
        </div>
        <div className="relative z-10 text-center px-12">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tight uppercase">My Social App</h1>
          <p className="text-blue-100 text-xl font-light">تواصل، شارك، واستكشف عالمك الخاص</p>
        </div>
      </div>

      {/* القسم الأيمن: نموذج التسجيل */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0B2C5A]">انضم إلينا الآن</h2>
            <p className="text-gray-500 mt-2 text-sm">كن جزءاً من مجتمع My Social App</p>
          </div>

          <div className="flex gap-3 mb-6">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-100 py-3 rounded-2xl hover:bg-gray-50 transition-all text-sm font-medium">
              <FcGoogle className="text-xl" /> Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-2xl hover:opacity-90 transition-all text-sm font-medium">
              <FaFacebookF className="text-xl" /> Facebook
            </button>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4 text-right" dir="rtl">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">الاسم الكامل</label>
              <input {...register("name")} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all" />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">البريد الإلكتروني</label>
              <input {...register("email")} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all" />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">كلمة المرور</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} {...register("password")} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all pl-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">تأكيد الكلمة</label>
                <div className="relative">
                  <input type={showRePassword ? "text" : "password"} {...register("rePassword")} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B2C5A] outline-none transition-all pl-10" />
                  <button type="button" onClick={() => setShowRePassword(!showRePassword)} className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    {showRePassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
                {errors.rePassword && <p className="text-red-500 text-[10px] mt-1">{errors.rePassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">تاريخ الميلاد</label>
                <input type="date" {...register("dateOfBirth")} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none" />
                {errors.dateOfBirth && <p className="text-red-500 text-[10px] mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div className="flex gap-4 p-2.5 bg-gray-50 rounded-xl border border-gray-100 justify-around">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" {...register("gender")} value="male" className="accent-[#0B2C5A]" /> ذكر
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" {...register("gender")} value="female" className="accent-[#0B2C5A]" /> أنثى
                </label>
              </div>
            </div>

            <button disabled={isLoading} className="w-full py-4 bg-[#0B2C5A] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#082144] transition-all flex items-center justify-center mt-6">
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "إنشاء الحساب"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            لديك حساب بالفعل؟ <Link to="/" className="text-[#0B2C5A] font-bold hover:underline">سجل دخولك</Link>
          </p>
        </div>
      </div>
    </div>
  )
}