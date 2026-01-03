// hooks/useLogin.ts
"use client"
import { useState } from "react";

export function useLogin(onSuccessNavigate?: () => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pEmail: email, pPassword: password }),
      });
      const data = await res.json();
      if (res.ok && data.loginResponse?.userRow) {
        setSuccess("Login successful!");
        const token = data.loginResponse.jwtToken;
        if (token) {
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("user", JSON.stringify(data.loginResponse.userRow));
          localStorage.setItem("username", data.loginResponse.userRow.username);
          console.log('userRow:', data.loginResponse.userRow); // Debug log
          const userId = data.loginResponse.userRow.id ?? data.loginResponse.userRow.user_id;
          localStorage.setItem("userId", String(userId));
          if (onSuccessNavigate) onSuccessNavigate();
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    success,
    handleSubmit,
  };
}
