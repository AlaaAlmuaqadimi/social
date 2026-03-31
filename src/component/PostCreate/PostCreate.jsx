import { Avatar, Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@heroui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { AuthContext } from '../Context/AuthContext'
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCreation() {
    const { isOpen, onOpen, onOpenChange ,onClose} = useDisclosure();
    const [viewImage, setViewImage] = useState(null)
    const { userToken } = useContext(AuthContext);
    const imageInput = useRef(null)
    const captionInput = useRef(null)
    function handelChangeFile(e) {
        // console.log(URL.createObjectURL(e.target.files[0]))
        setViewImage(URL.createObjectURL(e.target.files[0]))
    }
    function removeImage() {
        setViewImage(null)
        imageInput.current.value = "";
    }

    function handelCreatePost() {
        const postObj = new FormData
        if (captionInput.current.value) {
            postObj.append('body',captionInput.current.value)
        } if (imageInput.current.value) {
            postObj.append('image',imageInput.current.files[0])
        }

        return axios.post(`https://route-posts.routemisr.com/posts`,
            postObj,
            {
                headers: {
                    token: userToken
                }
            }
        )
    }

   const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: handelCreatePost,
        onSuccess: () => {
            removeImage()
            captionInput.current.value = '';
            onClose();
            queryClient.invalidateQueries({queryKey :['getPost'] , exact : true})
            toast.success('post created successfully',{onClose : 2000 ,closeOnClick : true })
        },

        onError: (err) => {
            toast.error('Error',{onClose : 2000 ,closeOnClick : true })
        }
    });

    return (
        <>
            <Card  className="bg-gradient-to-r from-pink-600 to-orange-600  my-2">
                <CardBody className="flex flex-row">
                    <Avatar
                        size="md"
                        className="w-fit"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                    <div
                        onClick={onOpen}
                        className=" bg-gradient-to-r from-orange-300 to-pink-400 cursor-pointer w-full ms-2 flex p-2 text-[#d0cece] rounded-2xl items-center hover:bg-gray-700/80"
                    >
                        <p className="text-white">What's on your mind</p>
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="bg-gradient-to-r from-orange-500 to-pink-500">
                    {(onClose) => (
                        <>
                            <div className="flex p-3">
                                <Avatar
                                    size="md"
                                    className="w-fit"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                                <h2 className="mx-3">name</h2>
                            </div>
                            <ModalHeader className="flex flex-col gap-1">
                                Create Post
                            </ModalHeader>
                            <ModalBody>
                                <Textarea ref={captionInput}
                                    placeholder="What's on your mind?"
                                    className="w-full"
                                />
                                {viewImage && <div className=" relative">
                                    <img src={viewImage}
                                        alt="" />
                                    <IoCloseCircleOutline onClick={removeImage} className="absolute top-0 right-0" />
                                </div>}
                            </ModalBody>
                            <ModalFooter>
                                <label onPress={onClose}>
                                    <LuImagePlus className=" cursor-pointer my-2 text-2xl" />
                                    <input type="file" ref={imageInput} hidden onChange={handelChangeFile} />
                                </label>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" disabled={isPending} onPress={mutate}>
                                    Post
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}