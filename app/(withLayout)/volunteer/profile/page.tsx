"use client";

import React from 'react';
import { VolunteerProfileForm } from './components/VolunteerProfileForm';
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <div className="min-h-screen">
        <VolunteerProfileForm />
      </div>
      <Footer />
    </ProtectedLayout>
  );
}