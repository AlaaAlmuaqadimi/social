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
    mutationFn: (passwords) => {
      return axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            token: userToken, // تعديل المفتاح ليكون token ليتوافق مع API Route
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.warn("Please fill all fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    changePass({ currentPassword, newPassword });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#f0f2f5]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-[#0B2C5A] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <i className="fa-solid fa-lock text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Security Settings</h2>
          <p className="text-xs text-blue-200 mt-1">Update your password to keep your account safe</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="password"
              variant="flat"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              classNames={{
                inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:!bg-white border-transparent focus-within:border-[#0B2C5A] transition-all rounded-2xl h-14",
                label: "text-[#0B2C5A] font-semibold text-xs",
              }}
            />

            <Input
              type="password"
              variant="flat"
              label="New Password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              classNames={{
                inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:!bg-white border-transparent focus-within:border-[#0B2C5A] transition-all rounded-2xl h-14",
                label: "text-[#0B2C5A] font-semibold text-xs",
              }}
            />

            <Input
              type="password"
              variant="flat"
              label="Confirm New Password"
              placeholder="Repeat new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              classNames={{
                inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:!bg-white border-transparent focus-within:border-[#0B2C5A] transition-all rounded-2xl h-14",
                label: "text-[#0B2C5A] font-semibold text-xs",
              }}
            />
          </div>

          <Button
            type="submit"
            isLoading={isPending}
            className="w-full h-14 bg-[#0B2C5A] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#1a3d6d] transition-all active:scale-95"
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>

          <p className="text-center text-[10px] text-gray-400">
            Forgot your password? <span className="text-[#0B2C5A] font-bold cursor-pointer hover:underline">Contact Support</span>
          </p>
        </form>
      </div>
    </div>
  );
}