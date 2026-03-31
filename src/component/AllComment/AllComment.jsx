import { useContext } from "react";
import { AuthContext } from '../Context/AuthContext'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BeatLoader } from "react-spinners"; // شكل أبسط وأرقى للتحميل داخل التعليقات

export default function AllComment({ postId }) {
  const { userToken } = useContext(AuthContext);

  function getAllComment() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      {
        headers: {
          token: userToken
        }
      }
    );
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getAllComment', postId],
    queryFn: getAllComment,
    enabled: !!postId,
  });

  if (isLoading) return (
    <div className="flex justify-center py-4">
      <BeatLoader size={8} color="#0B2C5A" />
    </div>
  );

  // تصحيح مسار البيانات بناءً على هيكلة الـ API الخاص بـ Route
  const comments = data?.data?.comments || [];

  if (comments.length === 0) return (
    <p className="text-center text-gray-400 text-xs py-4">No comments yet. Be the first to reply!</p>
  );

  return (
    <div className="space-y-4 mt-4 border-t border-gray-50 pt-4">
      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start gap-3 px-2 group">
          {/* صورة صاحب التعليق */}
          <div className="flex-shrink-0 mt-1">
            <img
              className="rounded-xl object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-105"
              src={comment.commentCreator.photo}
              width={36}
              height={36}
              alt={comment.commentCreator.name}
            />
          </div>

          {/* محتوى التعليق */}
          <div className="flex flex-col flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 transition-colors group-hover:bg-blue-50/50">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[#0B2C5A] text-[13px]">
                {comment.commentCreator.name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}