"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileAudio, FileText } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      href: "/",
      label: "Início",
      icon: Home,
    },
    {
      href: "/transcricao",
      label: "Transcrição",
      icon: FileAudio,
    },
    {
      href: "/conversor",
      label: "Conversor",
      icon: FileText,
    },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
