"use client";

import React from "react";

import ProtectedLayout from "@/components/layout/ProtectedLayout";

import { VolunteerProfileForm } from "@/components/layout/volunteer/VolunteerProfileForm";

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <div className="min-h-screen">
        <VolunteerProfileForm />
      </div>
    </ProtectedLayout>
  );
}
