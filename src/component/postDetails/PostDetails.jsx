
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners";
import { AuthContext } from '../Context/AuthContext'
import PostCard from "../PostCard/PostCard";
import { Button } from "@heroui/react";
import AllComment from './../AllComment/AllComment';
import { useContext, useState } from "react";

export default function PostDetails() {

  const { id } = useParams()
  const { userToken } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['getPostDetails', id],
    queryFn: getPostDetails,
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ClipLoader size={50} color="#000" />
      </div>
    )
  }

  if (isError) {
    // console.log(error)
    return <h2>Error</h2>
  }

  const PostDetailsObj = data?.data?.data.post

  return (
    <>
      <div className="m-6">
        <Link to='/'>
          <Button
            className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            radius="full"
          >
            Back
          </Button>
        </Link>
      </div>

      <div className="w-3/4 m-auto my-6 bg-gradient-to-r from-pink-500 to-orange-400 ">
        <PostCard postInfo={PostDetailsObj} queryKey={["getPostDetails", id]} />

        <div className="my-4 mb-5 text-black">
          {showComments && (
            <AllComment postId={id} />
          )}
          <p
            onClick={() => setShowComments(!showComments)}
            className="text-pink-600 bg-pink-300 rounded-2xl w-1/6 p-2 m-5 font-bold cursor-pointer"
          >
            {showComments ? "Hide Comments" : "View All Comments"}
          </p>



        </div>
      </div>
    </>
  )
}