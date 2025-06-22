"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import React from "react";

import HomePage from "@/app/(landing)/page";

const RoleBasedHomePage = () => {
  return (
    <ProtectedLayout>
      <HomePage />
    </ProtectedLayout>
  );
};

export default RoleBasedHomePage;
