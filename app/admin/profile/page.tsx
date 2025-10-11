"use client";

import ProfileManager from "@/components/admin/profile/ProfileManager";
import WebsiteSettings from "@/components/admin/profile/WebsiteSettings";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">基础信息管理</h2>
      <ProfileManager />
      <h2 className="text-2xl font-semibold">网站设置</h2>
      <WebsiteSettings />
    </div>
  );
} 