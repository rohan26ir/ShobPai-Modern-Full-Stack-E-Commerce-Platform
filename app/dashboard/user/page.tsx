"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomerOverview } from "@/components/dashboard/customer/CustomerOverview";
import LoadingCredentials from "@/components/LoadingCredentials";

export default function UserOverviewPage() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingCredentials />;
  }

  return <CustomerOverview user={user} token={token} />;
}

