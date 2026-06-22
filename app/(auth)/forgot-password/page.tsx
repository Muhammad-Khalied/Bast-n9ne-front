"use client";

import { useState } from "react";
import { Button, Input } from "../../../components/ui";
import api from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post("/auth/forgot-password", { email });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-heading">Reset password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit">Send reset link</Button>
      </form>
    </div>
  );
}
