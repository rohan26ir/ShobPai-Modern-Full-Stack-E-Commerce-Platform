"use client";

import React from "react";
import DashboardLayout from "../dashboard/layout";
import ProductAddPage from "../dashboard/product-add/page";

export default function StandaloneProductAdd() {
  return (
    <DashboardLayout>
      <ProductAddPage />
    </DashboardLayout>
  );
}

