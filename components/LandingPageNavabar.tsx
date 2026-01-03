import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Title with Icon */}
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

          {/* Buttons */}
          <div className="flex gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-slate-800  text-white hover:bg-slate-900"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-slate-800 text-white hover:bg-slate-900">
                Signup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}