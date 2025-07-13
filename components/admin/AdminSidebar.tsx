"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navItems = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: "dashboard"
  },
  {
    title: "个人信息",
    href: "/admin/profile",
    icon: "profile"
  },
  {
    title: "技术栈",
    href: "/admin/tech",
    icon: "tech"
  },
  {
    title: "项目管理",
    href: "/admin/projects",
    icon: "projects"
  },
  {
    title: "履历管理",
    href: "/admin/resumes",
    icon: "resumes"
  },
  // {
  //   title: "位置信息",
  //   href: "/admin/location",
  //   icon: "location"
  // },
  {
    title: "标签管理",
    href: "/admin/tags",
    icon: "tags"
  },
  {
    title: "附件管理",
    href: "/admin/attachments",
    icon: "attachments"
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <nav className="w-64 bg-white shadow-sm p-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavigation(item.href)}
            className={cn(
              "flex items-center px-4 py-2 rounded-lg",
              "hover:bg-gray-100 transition-colors",
              pathname === item.href ? "bg-gray-100" : ""
            )}
          >
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 