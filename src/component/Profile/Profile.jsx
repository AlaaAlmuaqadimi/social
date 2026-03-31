import { AuthContext } from '../Context/AuthContext'
import { useContext } from 'react'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ClipLoader } from "react-spinners";
import PostCreation from '../PostCreate/PostCreate';
// import Home from '../Home/Home';

export default function Profile() {

  const { userToken } = useContext(AuthContext);

  function userProfile() {
    return axios.get(
      `https://route-posts.routemisr.com/users/profile-data`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    )
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userProfile,
  })

  // console.log('userProfile', data?.data?.data)

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader size={50} />
      </div>
    )
  }

  if (isError) {
    // console.log(error)
    return <h2>Error loading profile</h2>
  }

  const user = data?.data?.data



  return (
    <>

      <div className="bg-gray-100 min-h-screen p-6">

        <div className=" mx-6">

          <div className="h-48 rounded-2xl bg-gradient-to-r from-pink-600 via-orange-700 to-orange-600"></div>

          <div className="bg-white rounded-2xl shadow-lg p-6 -mt-20 relative">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <img
                  src={user.user?.photo || '/default-avatar.png'}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                  alt="profile"
                />

                <div>
                  <h2 className="text-2xl font-bold">
                    {user.user?.name}
                  </h2>

                  <h2 className=" mt-2 text-xs bg-orange-100 text-pink-600 px-3 py-1 rounded-full">
                    {user.user?.username}
                  </h2>

                  <span className="inline-block mt-2 text-xs bg-orange-100 text-pink-600 px-3 py-1 rounded-full">
                    {user.user?.createdAt}
                  </span>

                </div>
              </div>

              <div className="flex gap-4 mt-4 md:mt-0">

                <div className="bg-orange-50 rounded-xl px-6 py-3 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">Followers</p>
                  <p className="font-bold text-xl">{user.user?.followers.length}</p>
                </div>

                <div className="bg-orange-50 rounded-xl px-6 py-3 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">Following</p>
                  <p className="font-bold text-xl">{user.user?.following.length}</p>
                </div>

                <div className="bg-orange-50 rounded-xl px-6 py-3 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">Bookmarks</p>
                  <p className="font-bold text-xl">{user.user?.bookmarks.length} </p>
                </div>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">

              <div className="col-span-2 bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">About</h3>

                <p className='my-2'>Gender :-{user.user?.gender}</p>

                <p className="">
                  Email :- {user.user?.email}
                </p>

                <p className='my-2'>  Birth Day :-{user.user.dateOfBirth}</p>

              </div>

              <div className="flex flex-col gap-4">

                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">My Posts</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Saved Posts</p>
                  <p className="font-bold text-xl">{user.user.bookmarks.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=' my-6'>
            <PostCreation />
          </div>
        </div>
      </div>
    </>

  )
}