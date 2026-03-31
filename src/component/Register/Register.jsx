import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Home from '../Home/Home';
import Login from '../Login/Login';
import swal from 'sweetalert';
import { ClipLoader } from "react-spinners";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const schema = zod.object({
  name: zod
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(25, "Name cannot be more than 20 characters"),

  email: zod.string().nonempty("email is required")
    .email("Invalid email format"),

  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),

  rePassword: zod.string(),

  dateOfBirth: zod
    .coerce
    .date({
      required_error: "Date of birth is required"
    })
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 10;
    }, {
      message: "You must be at least 10 years old"
    })
    .transform((date) => date.toISOString().split("T")[0]),

  gender: zod.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" })
  })
})
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"]
  });

export default function Register() {

  const [succes, setSucces] = useState(false)
  const [isError, setError] = useState(false)
  const [isLoding, setIsLoding] = useState(false)

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    },
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const { register, handleSubmit } = form

  function handelRegister(value) {
    setIsLoding(true);
    axios.post(`https://route-posts.routemisr.com/users/signup`, value)
      .then(res => {
        // console.log('Full response:', res.data);
        setSucces(true)
        swal({
          title: "Success!",
          text: "Registration successful!",
          icon: "success",
          timer: 2000,
          buttons: false
        }).then(() => {
          navigate("/home")
        });

        setTimeout(() => {
          setSucces(false)
        }, 2000)
      })
      .catch(err => {
        // console.error('Error details:', err);

        if (err.response) {
          // console.log('Server said:', err.response.data);

          setError(true)

          swal({
            title: "warning!",
            text: err.response?.data?.message || "Something went wrong",
            icon: "error",
            timer: 2000,
            buttons: false
          })
          setTimeout(() => {
            setError(false)
          }, 3000)
        }
      }
      ).finally(() => setIsLoding(false)
      )
  }

  return (
    <>

      {/* ------------------ */}
      <div className=' flex overflow-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50'>

<div className="w-1/2 min-h-screen">
  <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-12">

    <div className="relative z-10 max-w-3xl w-full text-center space-y-10">
      <h1 className="text-7xl sm:text-8xl md:text-[9rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 animate-pulse-slow select-none">
        Welcome
      </h1>

      <div className="space-y-5">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Hey there! 
        </h2>

        <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto leading-relaxed">
          Good to see you again. Ready when you are~
        </p>
      </div>
    </div>

    <p className="absolute bottom-8 text-sm text-gray-600 opacity-70">
      Your space is waiting
    </p>

  </div>
</div>

        {/* ------------------------ */}
        <div className="min-h-screen w-1/2 flex items-center justify-center  px-4 py-12">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-8">
              Create Account
            </h1>
            
                        <div className=' flex my-7'>
            
                          <button
            
                            className="w-full w-1/2 flex items-center justify-center gap-3 mx-2 bg-gradient-to-r from-pink-600 to-orange-600   hover:bg-gradient-to-l hover:from-pink-600 hover:to-orange-600 border-gray-300 text-white py-3.5 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <FcGoogle className="text-2xl" />
                            Google
                          </button>
            
                          <button
            
                            className="w-full w-1/2 mx-2 flex items-center justify-center gap-3  bg-gradient-to-r from-pink-600 to-orange-600   hover:bg-gradient-to-l hover:from-pink-600 hover:to-orange-600 text-white py-3.5 px-4 rounded-xl  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <FaFacebookF className="text-2xl" />
                            Facebook
                          </button>
                        </div>
                        <p className=' text-gray-700 mb-2 text-center'> or continue with email</p>
<hr className='mb-5 text-gray-500 w-10/12 m-auto' />
            <form onSubmit={handleSubmit(handelRegister)} className="space-y-6 ">
              <div className="relative">
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="block w-full px-4 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none peer transition-all duration-200"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-10 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-10 left-1 pointer-events-none"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="block w-full px-4 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none peer transition-all duration-200"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-10 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-10 left-1 pointer-events-none"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="block w-full px-4 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none peer transition-all duration-200"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-10 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-10 left-1 pointer-events-none"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  {...register("rePassword")}
                  type="password"
                  id="rePassword"
                  className="block w-full px-4 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none peer transition-all duration-200"
                  placeholder=" "
                />
                <label
                  htmlFor="rePassword"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-10 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-10 left-1 pointer-events-none"
                >
                  Confirm Password
                </label>
              </div>

              <div className="relative">
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  id="dateOfBirth"
                  className="block w-full px-4 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none peer transition-all duration-200"
                />
                <label
                  htmlFor="dateOfBirth"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-10 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-10 left-1 pointer-events-none"
                >
                  Date of Birth
                </label>
              </div>

              <div className="flex items-center space-x-8 pt-2">
                <div className="flex items-center">
                  <input
                    {...register("gender")}
                    id="male"
                    type="radio"
                    value="male"
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="male" className="ml-3 text-sm font-medium text-gray-700">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    {...register("gender")}
                    id="female"
                    type="radio"
                    value="female"
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="female" className="ml-3 text-sm font-medium text-gray-700">
                    Female
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              {/* <button
                type="submit"
                className="w-full py-3.5 px-4 mt-6 text-white font-semibold text-lg bg-gradient-to-r from-pink-600 to-orange-600   hover:bg-gradient-to-l hover:from-pink-600 hover:to-orange-600
                rounded-xl focus:ring-4 focus:ring-indigo-300 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >

                {isLoding ? <ClipLoader size={40} color="#f97316" /> : 'Create Account '}
              </button> */}
              <button
                type="submit"
                disabled={isLoding}
                className="w-full py-3.5 px-4 mt-6 text-white font-semibold text-lg bg-gradient-to-r from-pink-600 to-orange-600 rounded-xl"
              >
                {isLoding ? (
                  <ClipLoader size={25} color="#fff" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 hover:text-orange-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>


      </div>

    </>
  )
}