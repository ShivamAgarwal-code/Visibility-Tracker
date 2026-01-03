import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  return (
    <nav className="w-full bg-gray-100 shadow">
      <div className="flex flex-wrap items-center justify-between px-6 sm:px-12 lg:px-40 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            AI Search Visibility
          </span>
        </div>

        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-3 sm:mt-0 px-4 py-2 bg-slate-900 text-white rounded hover:opacity-90 w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
