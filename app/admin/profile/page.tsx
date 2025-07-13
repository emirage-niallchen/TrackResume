"use client";

import ProfileManager from "@/components/admin/profile/ProfileManager";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">个人信息管理</h2>
      <ProfileManager />
    </div>
  );
} 