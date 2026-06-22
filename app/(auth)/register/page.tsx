"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "../../../components/ui";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      window.location.href = "/";
    } catch (error: any) {
      const errorData = error.response?.data?.error;
      if (errorData?.code === "VALIDATION_ERROR" && errorData.details) {
        const firstError = Object.values(errorData.details)[0] as string[];
        toast.error(firstError[0] || "Validation failed");
      } else {
        toast.error(errorData?.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-brand-white p-8 md:p-12 shadow-elevated rounded-brand-lg">
        <div className="text-center">
          <h1 className="text-heading-xl font-display text-brand-black mb-2">Create Account</h1>
          <p className="text-sm text-brand-muted">Join the Bast n9ne club for exclusive access</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-charcoal mb-2">First Name</label>
              <Input 
                name="firstName"
                required
                placeholder="John" 
                value={formData.firstName} 
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-charcoal mb-2">Last Name</label>
              <Input 
                name="lastName"
                required
                placeholder="Doe" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-charcoal mb-2">Email Address</label>
              <Input 
                name="email"
                type="email"
                required
                placeholder="email@example.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-charcoal mb-2">Password</label>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-12 border-brand-ivory-dark focus:border-brand-sage"
              />
            </div>
          </div>

          <p className="text-[10px] text-brand-muted leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors uppercase tracking-[0.2em] font-bold text-xs"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="pt-6 border-t border-brand-ivory text-center">
          <p className="text-sm text-brand-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-brand-sage hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
