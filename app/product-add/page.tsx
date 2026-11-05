"use client";

import React from "react";
import DashboardLayout from "../dashboard/layout";
import ProductCreatePage from "../dashboard/products/create/page";

export default function StandaloneProductAdd() {
  return (
    <DashboardLayout>
      <ProductCreatePage />
    </DashboardLayout>
  );
}
