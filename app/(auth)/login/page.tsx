"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "../../../components/ui";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      window.location.href = "/";
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Invalid credentials";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-brand-white p-8 md:p-12 shadow-elevated rounded-brand-lg">
        <div className="text-center">
          <h1 className="text-heading-xl font-display text-brand-black mb-2">Sign In</h1>
          <p className="text-sm text-brand-muted">Enter your credentials to access your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">Email Address</label>
              <Input 
                name="email"
                type="email"
                required
                placeholder="email@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Password</label>
              </div>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors uppercase tracking-[0.2em] font-bold text-xs"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="pt-6 border-t border-brand-ivory text-center">
          <p className="text-sm text-brand-muted">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-brand-sage hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
