import { Avatar, Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@heroui/react";
import axios from "axios";
import { useRef, useState, useContext } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { AuthContext } from '../Context/AuthContext'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCreation() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [viewImage, setViewImage] = useState(null);
    const { userToken } = useContext(AuthContext);
    const imageInput = useRef(null);
    const captionInput = useRef(null);
    const queryClient = useQueryClient();

    // معالجة عرض الصورة قبل الرفع
    function handelChangeFile(e) {
        if (e.target.files[0]) {
            setViewImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    // إزالة الصورة المختارة
    function removeImage() {
        setViewImage(null);
        if (imageInput.current) imageInput.current.value = "";
    }

    // دالة إنشاء المنشور
    function createPostRequest() {
        const postObj = new FormData();
        if (captionInput.current?.value) postObj.append('body', captionInput.current.value);
        if (imageInput.current?.files[0]) postObj.append('image', imageInput.current.files[0]);

        return axios.post(`https://route-posts.routemisr.com/posts`, postObj, {
            headers: { token: userToken }
        });
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createPostRequest,
        onSuccess: () => {
            removeImage();
            if (captionInput.current) captionInput.current.value = '';
            onClose();
            queryClient.invalidateQueries({ queryKey: ['getPost'] });
            toast.success('Shared to your feed!');
        },
        onError: () => {
            toast.error('Something went wrong. Try again.');
        }
    });

    return (
        <>
            {/* واجهة البدء (Trigger Card) */}
            <Card className="bg-white border border-gray-100 shadow-sm rounded-[2rem] my-6 overflow-hidden">
                <CardBody className="flex flex-row items-center gap-4 p-4">
                    <Avatar
                        isBordered
                        color="default"
                        size="md"
                        src="https://i.pravatar.cc/150"
                        className="ring-2 ring-gray-50"
                    />
                    <div
                        onClick={onOpen}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex-1 py-3 px-6 rounded-2xl text-gray-400 font-medium text-sm"
                    >
                        Share a new digital foundation...
                    </div>
                    <Button 
                        isIconOnly 
                        variant="flat" 
                        radius="full" 
                        onClick={onOpen}
                        className="bg-blue-50 text-[#0B2C5A]"
                    >
                        <LuImagePlus size={20} />
                    </Button>
                </CardBody>
            </Card>

            {/* نافذة إنشاء المنشور (Modal) */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                backdrop="blur" 
                size="lg"
                className="rounded-[2.5rem]"
            >
                <ModalContent className="bg-white">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-gray-50">
                                <span className="text-[#0B2C5A] font-black tracking-tight italic">SAITY <span className="text-gray-300 font-light ml-2">| Create Post</span></span>
                            </ModalHeader>
                            
                            <ModalBody className="py-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar size="sm" src="https://i.pravatar.cc/150" />
                                    <span className="text-sm font-bold text-[#0B2C5A]">Your Identity</span>
                                </div>

                                <Textarea 
                                    ref={captionInput}
                                    placeholder="Write something architectural..."
                                    variant="flat"
                                    classNames={{
                                        inputWrapper: "bg-gray-50/50 hover:bg-gray-50 focus-within:!bg-white border-transparent focus-within:border-blue-100 transition-all rounded-2xl p-4",
                                        input: "text-lg text-gray-700"
                                    }}
                                />

                                {viewImage && (
                                    <div className="relative mt-4 group">
                                        <img 
                                            src={viewImage} 
                                            alt="Preview" 
                                            className="w-full rounded-2xl border border-gray-100 shadow-sm object-cover max-h-[300px]" 
                                        />
                                        <button 
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white/80 backdrop-blur-md text-red-500 rounded-full p-1 hover:bg-white transition-all shadow-md"
                                        >
                                            <IoCloseCircleOutline size={24} />
                                        </button>
                                    </div>
                                )}
                            </ModalBody>

                            <ModalFooter className="border-t border-gray-50 flex justify-between items-center">
                                <label className="group flex items-center gap-2 cursor-pointer text-gray-400 hover:text-[#0B2C5A] transition-colors">
                                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
                                        <LuImagePlus size={20} />
                                    </div>
                                    <span className="text-xs font-bold">Add Visuals</span>
                                    <input type="file" ref={imageInput} hidden onChange={handelChangeFile} />
                                </label>

                                <div className="flex gap-2">
                                    <Button variant="light" className="font-bold text-gray-400" onPress={onClose}>
                                        Discard
                                    </Button>
                                    <Button 
                                        className="bg-[#0B2C5A] text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                                        isLoading={isPending}
                                        onPress={mutate}
                                    >
                                        Deploy Post
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}