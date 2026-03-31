// import { ToastContainer } from "react-toastify";
import { Input } from "@heroui/react";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";
import { AuthContext } from '../Context/AuthContext'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { toast } from "react-toastify";

export default function CommentCreate({ postId, queryKey, commentCreatorId,id }) {

    const [commentValue, setCommentValue] = useState('');
    const { userToken } = useContext(AuthContext);
    const useQueryClientObj = useQueryClient()
    // console.log("postIdgggg:", postId);

    // console.log('postIdgggg', postId)
    function handleComment() {
        const commentObj = {
            content: commentValue
        };
        return axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            commentObj,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            }
        );
    }

    const { mutate: CreateCommentMutate, isPending } = useMutation({
        mutationFn: handleComment,

        onSuccess: () => {
            setCommentValue('');
            useQueryClientObj.invalidateQueries({ queryKey: queryKey });
            toast.success('comment created successfully', { onClose: 2000, closeOnClick: true })

        },

        onError: (err) => {
            // console.log(err);
            toast.error('Error', { onClose: 2000, closeOnClick: true })
        }
    });

    return (
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
                className="w-11/12 m-auto rounded-full bg-gradient-to-r from-orange-600 to-pink-700 "
                placeholder="Enter Your Comment"
                type="text"

                value={commentValue}

                onChange={(e) => setCommentValue(e.target.value)}

                endContent={
                    <div
                        onClick={isPending ? undefined : CreateCommentMutate}
                        className="cursor-pointer m-4"
                    >
                        <FaLocationArrow />
                    </div>
                }
            />

        </div>
    );
}