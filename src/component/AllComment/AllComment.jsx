import { useContext } from "react";
import { AuthContext } from '../Context/AuthContext'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ClipLoader } from "react-spinners";

export default function AllComment({ postId }) {
  const { userToken } = useContext(AuthContext);
  function getAllComment() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
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

  if (isLoading) return <p><ClipLoader/></p>;

  const comments = data?.data?.data?.comments || [];

  return (
    <>
      {comments.map((comment) => (
        <div key={comment._id} className="flex m-auto my-2">
          <div className="mx-3">
            <img
              className="rounded-2xl"
              src={comment.commentCreator.photo}
              width={40}
              height={40}
              alt=""
            />
          </div>

          <div>
            <p className="font-bold text-sm">
              {comment.commentCreator.name}
            </p>

            <p className="text-default-500 text-sm">
              {comment.content}
            </p>
          </div>
          
        </div>
      ))}
    </>
  );
}