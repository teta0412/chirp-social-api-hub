
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { Twitter } from "lucide-react";

export function Auth() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-twitter-primary items-center justify-center">
        <Twitter className="text-white h-72 w-72" />
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default Auth;
