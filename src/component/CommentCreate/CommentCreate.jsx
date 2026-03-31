import { Input } from "@heroui/react";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";
import { AuthContext } from '../Context/AuthContext'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { toast } from "react-toastify";

export default function CommentCreate({ postId, queryKey }) {
    const [commentValue, setCommentValue] = useState('');
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { mutate: CreateCommentMutate, isPending } = useMutation({
        mutationFn: (newComment) => {
            return axios.post(
                `https://route-posts.routemisr.com/posts/${postId}/comments`,
                { content: newComment },
                {
                    headers: {
                        // إرسال التوكن في مفتاح token لضمان التوافق مع API Route
                        token: userToken
                    }
                }
            );
        },

        onSuccess: () => {
            setCommentValue('');
            // تحديث قائمة التعليقات فوراً
            queryClient.invalidateQueries({ queryKey: queryKey });
            toast.success('Comment added', { position: "bottom-right", autoClose: 1500 });
        },

        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to add comment');
        }
    });

    const handleSend = () => {
        if (!commentValue.trim()) return;
        CreateCommentMutate(commentValue);
    };

    return (
        <div className="flex w-full items-center py-4 px-2 border-t border-gray-50 mt-2">
            <Input
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Write a comment..."
                variant="flat"
                radius="full"
                classNames={{
                    inputWrapper: "bg-gray-100 hover:bg-gray-200 focus-within:!bg-white border-transparent focus-within:border-[#0B2C5A] transition-all h-12 shadow-inner",
                    input: "text-sm text-gray-700 ml-2",
                }}
                endContent={
                    <button
                        onClick={handleSend}
                        disabled={isPending || !commentValue.trim()}
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 ${
                            isPending || !commentValue.trim() 
                            ? 'text-gray-300' 
                            : 'text-[#0B2C5A] hover:bg-blue-50'
                        }`}
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-[#0B2C5A] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FaLocationArrow className="rotate-45" />
                        )}
                    </button>
                }
            />
        </div>
    );
}