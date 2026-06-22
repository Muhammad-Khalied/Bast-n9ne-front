"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import Link from "next/link";
import { User, Mail, Calendar, ChevronRight, Shield, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/users");
      // Path: response.data (axios body) -> .data (controller wrapper) -> .data (service paginated results)
      setUsers(response.data.data.data ?? []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Users</h1>
          <p className="text-sm text-brand-muted">Manage customer accounts and administrative roles</p>
        </div>
      </div>

      <div className="bg-brand-white rounded-brand-lg shadow-sm border border-brand-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ivory text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted border-b border-brand-ivory-dark">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ivory">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-brand-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-brand-muted">No users found.</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-brand-ivory/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center text-brand-sage font-bold">
                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-black">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-brand-muted flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "ADMIN" ? "bg-brand-black text-brand-white" : "bg-brand-ivory-dark text-brand-charcoal"
                    }`}>
                      {user.role === "ADMIN" && <Shield className="w-2.5 h-2.5" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      user.status === "ACTIVE" ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-brand-charcoal flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-muted" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-brand-charcoal flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-brand-muted" />
                      {user._count?.orders || 0}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/users/${user.id}`}>
                      <button className="p-2 text-brand-muted hover:text-brand-black transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
