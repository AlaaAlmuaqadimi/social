import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@heroui/react";
import CommentCreate from "../CommentCreate/CommentCreate";
import PostDetails from '../postDetails/PostDetails';
import AllComment from '../AllComment/AllComment';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { AuthContext } from '../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { PiDeviceRotateBold } from "react-icons/pi";


export default function PostCard({ postInfo, queryKey, postId }) {
  const { body, image, likes, commentsCount, sharesCount, topComment, user, createdAt, isShare, id } = postInfo;
  const { userId, userToken } = useContext(AuthContext)
  const { _id } = user
  const isCardMyPost = _id === userId;
  const comment = topComment?.content
  const commentUser = topComment?.commentCreator?.name
  const commentPhoto = topComment?.commentCreator?.photo
  const commentCreatorId = topComment?.commentCreator?._id;
  const isMyComment = commentCreatorId === userId;
  const queryClient = useQueryClient()
  //  Delet Post
  function HandelDeletCatd(postId) {

    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    )
  }

  const { isPending, mutate: deletCard } = useMutation({
    mutationFn: HandelDeletCatd,

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['getPost'] })
      toast.success('Deleted successfully', {
        autoClose: 2000
      })
    },

    onError: (err) => {
      toast.error('Error', {
        autoClose: 2000
      })
    }
  })
  // update post
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  function handleUpdatePost({ postId, formData }) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      }
    );
  }

  const { mutate: updatePost } = useMutation({
    mutationFn: handleUpdatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPost'] });
      toast.success('Post updated successfully', { autoClose: 2000 });
    },
    onError: (err) => {
      toast.error('Failed to update post', { autoClose: 2000 });
    },
  });

  // deletComment
  function HandelDeletComment({ postId, commentId }) {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
  }

  const { mutate: deletComment } = useMutation({
    mutationFn: HandelDeletComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success('Comment Deleted successfully', { autoClose: 2000 });
    },
    onError: (err) => {
      toast.error('Failed to delete comment', { autoClose: 2000 });
    }
  });

  // update Comment

  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const [editedComment, setEditedComment] = useState('');

  function handleUpdateComment({ commentId, content }) {
    return axios.put(
      `https://route-posts.routemisr.com/comments/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
  }
  const { mutate: updateComment } = useMutation({
    mutationFn: handleUpdateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Comment updated successfully");

    },
    onError: () => {
      toast.error("Failed to update comment");
    }
  });
  return (
    <div>

      <Card className=" bg-gradient-to-r from-pink-500 to-orange-400  ">
        <CardHeader className="flex justify-between gap-5 ">
          <div className=" flex">
            <Image
              alt="heroui logo"
              height={40}
              radius="sm"
              src={user.photo}
              width={40}
            />
            <div className="flex mx-2 flex-col">
              <p className="text-md">{user.name}</p>
              <p className="text-small text-default-500">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div>

            {isCardMyPost &&
              <Dropdown className='bg-pink-100 rounded-3xl'>
                <DropdownTrigger>
                  <HiOutlineDotsVertical />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">Save</DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setSelectedPost(postInfo);
                      setEditImage(null);
                      setPreviewImage(postInfo.image);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem onClick={() => deletCard(id)} key="delete" className="text-danger" color="danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            }
          </div>
        </CardHeader>
        <hr />
        <Divider className="flex m-auto" />
        <CardBody className="m-auto">
          <p className=" text-center my-4">{body}</p>
          <Image
            alt={user.name}
            src={image}
          />
        </CardBody>
        <Divider />
        <hr />
        <CardFooter className="flex justify-between">
          <div><h6> <AiFillLike size={25} /> {likes.length}</h6></div>
          <div><h6><FaComment size={25} /> {commentsCount}</h6></div>
          <div><h6><PiDeviceRotateBold size={25} />
            {sharesCount}</h6></div>
          <div>
            <Link to={`/PostDetails/${id}`} className=" p-1 rounded-2xl bg-gradient-to-r from-orange-600 to-pink-500 m-4">
              View details
            </Link>
          </div>

        </CardFooter>
        <div>
          <CommentCreate postId={id} queryKey={['getPost']} />

        </div>
        <div className='flex justify-between'>
          <div className="flex  my-2">
            <div className="mx-3" >
              <Image
                className=" rounded-2xl"
                alt="heroui logo"
                height={40}
                radius="sm"
                src={commentPhoto}
                width={40}
              /></div>
            <div>
              <p className="font-bold text-sm">
                {commentUser}
              </p>
              <p className="text-default-500 text-sm">
                {comment}
              </p>
            </div>
          </div>

          <div className='m-4'>
            {isMyComment &&
              <Dropdown className=' bg-pink-100'>
                <DropdownTrigger>
                  <HiOutlineDotsVertical />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    onClick={() => {
                      setEditedComment(topComment?.content || '');
                      setIsEditCommentOpen(true);
                    }}
                    key="edit"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      if (topComment?._id) {
                        deletComment({
                          postId: id,
                          commentId: topComment._id
                        });
                      } else {
                        toast.warn("No comment ID found");
                      }
                    }}
                    key="delete" className="text-danger" color="danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            }
          </div>
        </div>
        {/* {commentsCount > 1 &&
          <Link className=" text-blue-700 m-4">
            View all comments...

          </Link>
        } */}
        {/* <CommentCreate postId={id} queryKey={queryKey} /> */}
      </Card>
      <Modal className='bg-amber-100' isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Post</ModalHeader>
              <ModalBody>
                <Textarea
                  defaultValue={selectedPost?.body}
                  id="editBody"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="my-3 rounded-xl"
                  />

                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    const newBody = document.getElementById("editBody").value;
                    const formData = new FormData();
                    formData.append("body", newBody);
                    if (editImage) {
                      formData.append("image", editImage);
                    }
                    updatePost({
                      postId: id,
                      formData,
                    });
                    onClose();
                  }}
                >
                  Update
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        className=' bg-orange-600'
        isOpen={isEditCommentOpen}
        onOpenChange={setIsEditCommentOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Comment</ModalHeader>

              <ModalBody>
                <Textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>

                <Button
                  color="primary"
                  onPress={() => {
                    if (!editedComment.trim()) {
                      toast.error("Comment is required");
                      return;
                    }

                    updateComment({
                      commentId: topComment._id,
                      content: editedComment
                    });

                    onClose();
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}