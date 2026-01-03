"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/modules/login/hooks/useLogin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { error } from "console";


export function LoginPage() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    success,
    handleSubmit,
  } = useLogin(() => {
    toast.success("Login successful!");
    router.push("/home");
  });
  const [showLoading, setShowLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLoading(true);
    const minLoading = new Promise((res) => setTimeout(res, 2000));
    await Promise.all([handleSubmit(e), minLoading]);
    setShowLoading(false);

    
   if (success) {
      toast.success("Login successful!");
    }
    
    // else if (typeof error === "string" && error) {
    //   toast.error("Login failed. Please check your credentials.");
    // }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-8 lg:p-12">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur shadow-lg rounded-2xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Welcome 
            </CardTitle>
            <p className="text-slate-600">Sign in to your account</p>
            <CardAction>
              <Link href="/signup" className="text-sm font-medium text-indigo-500 hover:text-indigo-600">
                Don&apos;t have an account? Sign Up
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-medium rounded-lg shadow-md flex items-center justify-center"
                  disabled={loading || showLoading}
                >
                  {loading || showLoading ? <Loading /> : "Sign in to Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - Login image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">  
        {/* Image */}
        <div className="w-full max-w-md relative">
          <div className="relative w-full aspect-square">
            <Image 
              src="/loginpage.png" 
              alt="Person working on laptop"
              width={900}
              height={900}
              className="object-contain"
              priority
            />
          </div>                      
        </div>
      </div>
    </div>
  );
}

export default LoginPage;