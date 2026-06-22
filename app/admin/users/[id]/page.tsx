"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../../../lib/api";
import { 
  User, Mail, Phone, Calendar, Clock, 
  MapPin, ShoppingBag, Shield, CheckCircle, 
  AlertCircle, ArrowLeft, MoreVertical 
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface PageProps {
  params: { id: string };
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    toast.success("Email copied to clipboard");
    setIsMenuOpen(false);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/users/${params.id}`);
      setUser(response.data.data);
    } catch (error) {
      toast.error("Failed to load user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/users/${params.id}/status`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchUser();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/users" className="text-sm text-brand-muted hover:text-brand-sage flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-brand-ivory flex items-center justify-center text-brand-sage text-2xl font-bold border-2 border-brand-ivory-dark">
              {user.firstName?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-brand-black">{user.firstName} {user.lastName}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  user.role === "ADMIN" ? "bg-brand-black text-brand-white" : "bg-brand-ivory-dark text-brand-charcoal"
                }`}>
                  {user.role}
                </span>
              </div>
              <p className="text-brand-muted flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 relative" ref={menuRef}>
            <select 
              value={user.status}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-brand-white border border-brand-ivory-dark rounded-brand px-4 py-2 text-sm font-medium focus:ring-1 focus:ring-brand-sage outline-none transition-all disabled:opacity-50"
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border border-brand-ivory-dark rounded-brand hover:bg-brand-ivory transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-brand-muted" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-brand-white border border-brand-ivory-dark rounded-brand shadow-lg overflow-hidden z-10 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={handleCopyEmail}
                  className="w-full text-left px-4 py-2 text-sm text-brand-black hover:bg-brand-ivory transition-colors"
                >
                  Copy Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Overview */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-sage" /> Account Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Phone Number</p>
                <p className="text-sm text-brand-charcoal flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-muted" /> {user.phone || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Customer Since</p>
                <p className="text-sm text-brand-charcoal flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-muted" /> {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Last Activity</p>
                <p className="text-sm text-brand-charcoal flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-muted" /> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Total Orders</p>
                <p className="text-sm text-brand-charcoal flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-brand-muted" /> {user._count?.orders || 0} orders
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex justify-between items-center">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-sage" /> Saved Addresses
              </h3>
              <span className="text-[10px] font-bold text-brand-muted uppercase">{user.addresses?.length || 0} total</span>
            </div>
            <div className="p-6">
              {!user.addresses?.length ? (
                <p className="text-center py-4 text-sm text-brand-muted">No addresses saved.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr: any) => (
                    <div key={addr.id} className="p-4 rounded-brand border border-brand-ivory-dark bg-brand-ivory/10 relative">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-[8px] font-bold uppercase tracking-tighter bg-brand-sage/20 text-brand-sage px-1.5 py-0.5 rounded">Default</span>
                      )}
                      <p className="text-xs font-bold text-brand-black mb-1">{addr.fullName}</p>
                      <p className="text-[11px] text-brand-charcoal leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state}<br />
                        {addr.country}
                      </p>
                      <p className="text-[11px] text-brand-muted mt-2 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="space-y-8">
           <div className="bg-brand-white rounded-brand-lg border border-brand-ivory-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-ivory-dark bg-brand-ivory/20 flex justify-between items-center">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-sage" /> Recent Orders
              </h3>
            </div>
            <div className="divide-y divide-brand-ivory">
              {!user.orders?.length ? (
                <div className="p-8 text-center text-sm text-brand-muted">No order history.</div>
              ) : user.orders.map((order: any) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-4 hover:bg-brand-ivory/30 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-brand-black group-hover:text-brand-sage transition-colors">#{order.orderNumber}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      order.status === 'DELIVERED' ? 'bg-status-success/10 text-status-success' :
                      order.status === 'CANCELLED' ? 'bg-status-error/10 text-status-error' :
                      'bg-brand-ivory-dark text-brand-charcoal'
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-brand-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs font-bold text-brand-black">EGP {Number(order.total).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
            {user.orders?.length > 0 && (
              <div className="p-4 border-t border-brand-ivory-dark">
                <Link href={`/admin/orders?userId=${user.id}`} className="text-[10px] font-bold text-brand-muted hover:text-brand-sage transition-colors uppercase tracking-widest block text-center">
                  View All Orders
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
