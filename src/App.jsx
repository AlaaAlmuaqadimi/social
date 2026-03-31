import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './component/Layout/Layout'
import Home from './component/Home/Home'
import Register from './component/Register/Register'
import Login from './component/Login/Login'
import Notfound from './component/Notfound/Notfound'
import { HeroUIProvider } from "@heroui/react";
import AuthContextProvider from './component/Context/AuthContext'
// import Profile from './component/profile/Profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './component/postDetails/PostDetails'
import Notifications from './component/Notifications/Notifications'
import { ToastContainer } from 'react-toastify'
import ChangePasswordPage from './component/ChangePassword/ChangePasswordPage'
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute'
import Profile from './component/profile/Profile'
// Profile
const router = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
{
  path: 'login',
  element: (
    <ProtectedRoute isAuth={true}>
      <Login />
    </ProtectedRoute>
  )
},
{
  path: 'register',
  element: (
    <ProtectedRoute isAuth={true}>
      <Register />
    </ProtectedRoute>
  )
},
{
  index: true,
  element: (
    <ProtectedRoute isAuth={false}>
      <Home />
    </ProtectedRoute>
  )
},
{
  path: 'PostDetails/:id',
  element: (
    <ProtectedRoute isAuth={false}>
      <PostDetails />
    </ProtectedRoute>
  )
},
{
  path: 'profile',
  element: (
    <ProtectedRoute isAuth={false}>
      <Profile />
    </ProtectedRoute>
  )
},
{
  path: 'Notifications',
  element: (
    <ProtectedRoute isAuth={false}>
      <Notifications />
    </ProtectedRoute>
  )
},
{
  path: 'ChangePasswordPage',
  element: (
    <ProtectedRoute isAuth={false}>
      <ChangePasswordPage />
    </ProtectedRoute>
  )
},
      { path: '*', element: <Notfound /> }
    ]
  }
])

const configQueryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={configQueryClient}>
        <AuthContextProvider>
          <HeroUIProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
