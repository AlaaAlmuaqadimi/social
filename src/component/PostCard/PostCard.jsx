import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@heroui/react";
import CommentCreate from "../CommentCreate/CommentCreate";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AuthContext } from '../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";

export default function PostCard({ postInfo, queryKey }) {
  const { body, image, likes, commentsCount, sharesCount, topComment, user, createdAt, id } = postInfo;
  const { userId, userToken } = useContext(AuthContext);
  const isCardMyPost = user._id === userId;
  const queryClient = useQueryClient();

  // تعديل الـ Headers لتعمل مع الـ API بشكل صحيح
  const config = { headers: { token: userToken } };

  // --- Mutations ---
  const { mutate: deletCard } = useMutation({
    mutationFn: (postId) => axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPost'] });
      toast.success('Post removed');
    }
  });

  const { mutate: updatePost } = useMutation({
    mutationFn: ({ postId, formData }) => axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPost'] });
      toast.success('Post updated');
      setIsEditOpen(false);
    }
  });

  const { mutate: deletComment } = useMutation({
    mutationFn: ({ postId, commentId }) => axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success('Comment deleted');
    }
  });

  // --- States ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(image);
  const [editImage, setEditImage] = useState(null);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-[2rem] overflow-hidden mb-6">
      {/* Header: User Info & Options */}
      <CardHeader className="flex justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <Image
            alt="user"
            className="rounded-xl object-cover border border-gray-50"
            height={45}
            src={user.photo}
            width={45}
          />
          <div className="flex flex-col">
            <p className="text-sm font-bold text-[#0B2C5A]">{user.name}</p>
            <p className="text-[10px] text-gray-400 font-medium">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {isCardMyPost && (
          <Dropdown className="rounded-2xl border border-gray-50 shadow-xl">
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full" size="sm" className="text-gray-400">
                <HiOutlineDotsVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions" variant="flat">
              <DropdownItem key="edit" onClick={() => setIsEditOpen(true)}>Edit Post</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => deletCard(id)}>
                Delete Post
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>

      {/* Body: Text & Image */}
      <CardBody className="px-5 pt-0 pb-4">
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{body}</p>
        {image && (
          <Image
            alt="post content"
            className="w-full object-cover rounded-2xl"
            src={image}
          />
        )}
      </CardBody>

      <Divider className="opacity-50" />

      {/* Footer: Stats & Interaction */}
      <CardFooter className="flex flex-col p-4 gap-4">
        <div className="flex justify-around w-full items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <AiOutlineLike size={22} className="text-gray-400 group-hover:text-[#0B2C5A] transition" />
            <span className="text-xs font-bold text-gray-500">{likes.length}</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <FaComment size={18} className="text-gray-400 group-hover:text-blue-500 transition" />
            <span className="text-xs font-bold text-gray-500">{commentsCount}</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <PiShareFatBold size={20} className="text-gray-400 group-hover:text-green-500 transition" />
            <span className="text-xs font-bold text-gray-500">{sharesCount}</span>
          </div>
          <Link to={`/PostDetails/${id}`} className="text-[11px] font-black text-[#0B2C5A] hover:underline uppercase tracking-tighter">
            View Details
          </Link>
        </div>

        {/* Comment Creation Section */}
        <div className="w-full bg-gray-50 rounded-2xl p-1">
          <CommentCreate postId={id} queryKey={['getPost']} />
        </div>

        {/* Top Comment Preview */}
        {topComment && (
          <div className="w-full flex items-start gap-3 p-3 bg-blue-50/30 rounded-2xl border border-blue-50/50">
            <Image
              className="rounded-lg object-cover"
              height={32}
              src={topComment.commentCreator.photo}
              width={32}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-[12px] font-bold text-[#0B2C5A]">{topComment.commentCreator.name}</p>
                {topComment.commentCreator._id === userId && (
                  <button onClick={() => deletComment({ postId: id, commentId: topComment._id })} className="text-[10px] text-red-400 hover:text-red-600">Delete</button>
                )}
              </div>
              <p className="text-[12px] text-gray-600">{topComment.content}</p>
            </div>
          </div>
        )}
      </CardFooter>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen} backdrop="blur" className="rounded-[2.5rem]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#0B2C5A]">Edit Your Story</ModalHeader>
              <ModalBody>
                <Textarea
                  label="What's on your mind?"
                  variant="flat"
                  defaultValue={body}
                  id="editBody"
                  classNames={{ inputWrapper: "bg-gray-100 rounded-2xl" }}
                />
                <div className="relative group">
                  <img src={previewImage} alt="preview" className="w-full h-48 object-cover rounded-2xl mt-4 border border-gray-100" />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer text-white text-xs font-bold">
                    Change Image
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) { setEditImage(file); setPreviewImage(URL.createObjectURL(file)); }
                    }} />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="rounded-xl font-bold">Cancel</Button>
                <Button className="bg-[#0B2C5A] text-white rounded-xl font-bold" onPress={() => {
                   const formData = new FormData();
                   formData.append("body", document.getElementById("editBody").value);
                   if (editImage) formData.append("image", editImage);
                   updatePost({ postId: id, formData });
                }}>Update Post</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}