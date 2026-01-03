"use client";
import { Button } from "@/components/ui/button";
import {  Card,  CardAction,  CardContent,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSignup } from "@/modules/signup/hooks/useSignup";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");

  const { signup, loading, error, success } = useSignup(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({ email, username, firstname, lastname, password });

    if (error) {
      toast.error(error);
    }

    if (success) {
      toast.success(success);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Left side - Signup form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-8 lg:p-12">
          <Card className="w-full max-w-md bg-white/70 backdrop-blur shadow-lg rounded-2xl border-0">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Create an Account
              </CardTitle>
              <p className="text-slate-600">
                Join us by creating a new account
              </p>
              <CardAction>
                <Link
                  href="/login"
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                >
                  Already have an account? Login
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="test@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username" className="text-slate-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="testuser"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="firstname" className="text-slate-700">
                      First Name
                    </Label>
                    <Input
                      id="firstname"
                      type="text"
                      placeholder="Test"
                      required
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastname" className="text-slate-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastname"
                      type="text"
                      placeholder="User"
                      required
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="bg-white/50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-slate-700">
                        Password
                      </Label>
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
                    className="w-full py-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-medium rounded-lg shadow-md"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Signup image*/}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
          <div className="w-full max-w-md relative">
            <div className="relative w-full aspect-square">
              <Image
                src="/loginpage.png"
                alt="Illustration for signup"
                width={900}
                height={900}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
