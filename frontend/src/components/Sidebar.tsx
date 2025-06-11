"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mic,
  Settings,
  HelpCircle,
  FileUp,
  PencilRuler,
} from "lucide-react";

const menuItems = [
  {
    name: "Início",
    href: "/",
    icon: Home,
  },
  {
    name: "Transcrição",
    href: "/transcricao",
    icon: Mic,
  },
  {
    name: "Conversor",
    href: "/conversor",
    icon: FileUp,
  },
  {
    name: "Excalidraw",
    href: "/excalidraw",
    icon: PencilRuler,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AT</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Andre Tools</span>
        </Link>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Menu Inferior */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full">
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </button>
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full">
            <HelpCircle className="h-5 w-5" />
            <span>Ajuda</span>
          </button>
        </div>
      </div>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Andre Tools v1.5</p>
          <p>Powered by @andrezaolucas</p>
        </div>
      </div>
    </div>
  );
}
