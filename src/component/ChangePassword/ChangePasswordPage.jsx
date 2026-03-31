import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Input } from "@heroui/react";
import { AuthContext } from "../Context/AuthContext";

export default function ChangePasswordPage() {
  const { userToken } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { mutate: changePass, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }) => {
      return axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
        password: currentPassword, 
        newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    },

    onSuccess: () => {
      toast.success("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "error"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.warn("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("The new password and its confirmation do not match");
      return;
    }

    changePass({ currentPassword, newPassword });
  };

  return (

<div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-r from-pink-600 to-orange-600 rounded-xl shadow-2xl text-white">
  <h2 className="text-2xl font-bold mb-8 text-center drop-shadow-md">
    Change Password
  </h2>

  <form onSubmit={handleSubmit} className="space-y-5">
    <Input
      type="password"
      label="Current password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
      labelClassName="text-white/90 font-medium"
    />

    <Input
      type="password"
      label="New password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
      labelClassName="text-white/90 font-medium"
    />

    <Input
      type="password"
      label="Confirm new password"
      value={confirmNewPassword}
      onChange={(e) => setConfirmNewPassword(e.target.value)}
      className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
      labelClassName="text-white/90 font-medium"
    />

    <Button
      type="submit"
      color="primary"
      isLoading={isPending}
      className="w-full bg-white text-pink-600 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
    >
 {isPending ? "Changing..." : "Change Password"}    
    </Button>
  </form>
</div>
  );
}