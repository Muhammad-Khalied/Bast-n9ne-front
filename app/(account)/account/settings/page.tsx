"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import { Loader2, Shield, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    api.get("/me").then((response) => {
      const data = response.data.data;
      setProfile(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.put("/me", { firstName, lastName, phone });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    // Check complexity
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error("Password must be at least 8 chars, contain an uppercase, lowercase, and a number.");
      return;
    }
    
    setIsSavingPassword(true);
    setPasswordMessage("");
    try {
      await api.put("/me/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password successfully updated.");
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-sage" /></div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-heading-lg font-heading text-brand-black">Account Settings</h1>

      {/* Profile Details */}
      <div className="rounded-brand-lg bg-brand-white shadow-card border border-brand-ivory-dark overflow-hidden">
        <div className="p-6 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-3">
          <User className="w-5 h-5 text-brand-sage" />
          <h2 className="font-heading text-heading-sm text-brand-black">Profile Details</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSavingProfile}
              className="px-6 py-2.5 bg-brand-sage text-white rounded-brand font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security */}
      <div className="rounded-brand-lg bg-brand-white shadow-card border border-brand-ivory-dark overflow-hidden">
        <div className="p-6 border-b border-brand-ivory-dark bg-brand-ivory/20 flex items-center gap-3">
          <Shield className="w-5 h-5 text-brand-sage" />
          <h2 className="font-heading text-heading-sm text-brand-black">Security</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm"
                required
              />
            </div>
          </div>
          
          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.includes('success') ? 'text-status-success' : 'text-status-error'}`}>
              {passwordMessage}
            </p>
          )}

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSavingPassword}
              className="px-6 py-2.5 bg-brand-black text-white rounded-brand font-medium hover:bg-brand-charcoal transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
