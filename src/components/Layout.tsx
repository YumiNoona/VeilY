import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare, Share2, Bot, MessageCircle } from "lucide-react";

export const Layout = () => {
    const location = useLocation();

    const tabs = [
        {
            id: "chat",
            label: "Chat",
            path: "/",
            icon: MessageSquare,
        },
        {
            id: "ai-chat",
            label: "AI Chat",
            path: "/ai-chat",
            icon: Bot,
        },
        {
            id: "social",
            label: "Social Post",
            path: "/social",
            icon: Share2,
        },
        {
            id: "comments",
            label: "Comments",
            path: "/comments",
            icon: MessageCircle,
        },
    ];

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col font-sans overflow-hidden">
            <header className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center h-12 pointer-events-none lg:pl-[450px]">
                <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-border/50 p-1 rounded-full shadow-sm flex items-center gap-1">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};
