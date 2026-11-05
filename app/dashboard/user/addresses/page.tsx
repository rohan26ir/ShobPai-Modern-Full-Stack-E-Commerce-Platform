"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomerAddressesView } from "@/components/dashboard/customer/CustomerAddressesView";
import LoadingCredentials from "@/components/LoadingCredentials";

export default function UserAddressesPage() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingCredentials />;
  }

  return <CustomerAddressesView user={user} token={token} />;
}

