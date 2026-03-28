import React, { useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, Bot, MessageCircle, Crown, GalleryVerticalEnd, AtSign, Phone } from "lucide-react";
import { AuthModal } from "@/components/modals/AuthModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { TitleBar } from "@/components/layout/TitleBar";
import { isElectron } from "@/lib/electron-utils";
import { useOfflineDetection } from "@/hooks/useOfflineDetection";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export const Layout = () => {
    const location = useLocation();
    const { user, plan, setUpgradeModalOpen } = useAuth();
    
    // Global Hooks
    useOfflineDetection();
    useKeyboardShortcuts();
    
    const tabs = [
        { id: "chat", label: "Chat", path: "/", icon: MessageSquare },
        { id: "ai-chat", label: "AI Chat", path: "/ai-chat", icon: Bot },
        { id: "social", label: "Social", path: "/social", icon: Share2 },
        { id: "comments", label: "Comments", path: "/comments", icon: MessageCircle },
        { id: "stories", label: "Stories", path: "/stories", icon: GalleryVerticalEnd },
        { id: "email", label: "Email", path: "/email", icon: AtSign },
        { id: "group-call", label: "Call", path: "/group-call", icon: Phone },
    ];

    // Dynamic page title per route
    useEffect(() => {
        const tab = tabs.find(t => t.path === location.pathname);
        document.title = tab ? `${tab.label} — Veily` : 'Veily';
    }, [location.pathname]);

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col font-sans overflow-hidden">
            {isElectron() && <TitleBar />}
            <AuthModal />
            <UpgradeModal />
            <ProfileModal />
            <Navbar />

            <main className="flex-1 overflow-hidden relative">
                <Outlet />
                
            </main>
        </div>
    );
};
