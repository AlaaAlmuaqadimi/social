import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from '../Context/AuthContext';
import PostCard from "../PostCard/PostCard";
import { Button, Divider } from "@heroui/react";
import AllComment from './../AllComment/AllComment';
import { useContext, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function PostDetails() {
  const { id } = useParams();
  const { userToken } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: userToken // التحديث ليتماشى مع متطلبات الـ API الخاصة بك
      }
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPostDetails', id],
    queryFn: getPostDetails,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <ClipLoader size={40} color="#0B2C5A" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h2 className="text-[#0B2C5A] font-bold text-xl">Unable to load post</h2>
        <Link to="/">
          <Button variant="flat" color="primary" radius="xl">Return Home</Button>
        </Link>
      </div>
    );
  }

  const PostDetailsObj = data?.data?.post; // التأكد من مسار البيانات الصحيح

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link to='/'>
          <Button
            className="bg-white border border-gray-100 text-[#0B2C5A] font-bold shadow-sm hover:bg-gray-50 transition-all"
            radius="xl"
            startContent={<IoIosArrowBack size={18} />}
          >
            Back to Feed
          </Button>
        </Link>
        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Post Exploration</span>
      </div>

      {/* Main Post Content */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 bg-white border border-gray-50">
        <PostCard postInfo={PostDetailsObj} queryKey={["getPostDetails", id]} />

        {/* Interaction Section */}
        <div className="bg-gray-50/50 p-6">
          <div className="flex items-center gap-4 mb-4">
             <Divider className="flex-1 opacity-50" />
             <Button
                variant="light"
                onClick={() => setShowComments(!showComments)}
                className={`font-black text-xs uppercase tracking-tighter ${showComments ? 'text-red-500' : 'text-[#0B2C5A]'}`}
             >
               {showComments ? "Close Discussion" : `View Conversation`}
             </Button>
             <Divider className="flex-1 opacity-50" />
          </div>

          {showComments ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <AllComment postId={id} />
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm font-medium py-4">
              Click to view thoughts and feedback on this post.
            </p>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          Secure Digital Asset &copy; 2026 SAITY
        </p>
      </footer>
    </div>
  );
}