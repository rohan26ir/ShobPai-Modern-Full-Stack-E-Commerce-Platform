"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomerSettingsView } from "@/components/dashboard/customer/CustomerSettingsView";
import LoadingCredentials from "@/components/LoadingCredentials";

export default function AccountPage() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingCredentials />;
  }

  return <CustomerSettingsView user={user} token={token} />;
}
