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
import { UpdateModal } from "@/components/modals/UpdateModal";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";

export const Layout = () => {
    const location = useLocation();
    const { user, plan, setUpgradeModalOpen } = useAuth();
    
    const { updateAvailable, currentVersion, latestVersion, dismiss, releasesUrl } = useUpdateChecker();
    
    const tabs = [
        { id: "chat", label: "Chat", path: "/app", icon: MessageSquare },
        { id: "ai-chat", label: "AI Chat", path: "/app/ai-chat", icon: Bot },
        { id: "social", label: "Social", path: "/app/social", icon: Share2 },
        { id: "comments", label: "Comments", path: "/app/comments", icon: MessageCircle },
        { id: "stories", label: "Stories", path: "/app/stories", icon: GalleryVerticalEnd },
        { id: "email", label: "Email", path: "/app/email", icon: AtSign },
        { id: "group-call", label: "Call", path: "/app/group-call", icon: Phone },
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
            <UpdateModal
                open={updateAvailable}
                onOpenChange={(open) => { if (!open) dismiss(); }}
                currentVersion={currentVersion}
                latestVersion={latestVersion}
                releasesUrl={releasesUrl}
            />
            <Navbar />

            <main className="flex-1 overflow-hidden relative">
                <Outlet />
                
            </main>
        </div>
    );
};
