"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomerOrdersView } from "@/components/dashboard/customer/CustomerOrdersView";
import LoadingCredentials from "@/components/LoadingCredentials";

export default function UserOrdersPage() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingCredentials />;
  }

  return <CustomerOrdersView user={user} token={token} />;
}

