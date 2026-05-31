import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import { 
    MessageSquare, 
    Share2, 
    Bot, 
    MessageCircle, 
    User as UserIcon, 
    LogOut,
    GalleryVerticalEnd,
    AtSign
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

interface PillState {
  left: number;
  width: number;
}

export const Navbar = () => {
    const location = useLocation();
    const { 
        user, 
        signOut, 
        setProfileModalOpen,
        setAuthModalOpen,
        fullName,
        avatarUrl 
    } = useAuth();

    const tabs = [
        { id: "chat", label: "Chat", path: "/", icon: MessageSquare },
        { id: "ai-chat", label: "AI Chat", path: "/ai-chat", icon: Bot },
        { id: "social", label: "Social", path: "/social", icon: Share2 },
        { id: "comments", label: "Comments", path: "/comments", icon: MessageCircle },
        { id: "stories", label: "Stories", path: "/stories", icon: GalleryVerticalEnd },
        { id: "email", label: "Email", path: "/email", icon: AtSign },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const [pill, setPill] = useState<PillState>({ left: 0, width: 0 });
    const [mounted, setMounted] = useState(false);

    const activeIndex = tabs.findIndex(t => t.path === location.pathname);
    const activeTab = tabs[activeIndex] || tabs[0];

    useEffect(() => {
      const el = tabRefs.current.get(activeTab.id);
      if (el && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        setPill({ left: rect.left - containerRect.left, width: rect.width });
      }
      // Mark mounted after first measurement so the entrance transition doesn't play
      if (!mounted) setMounted(true);
    }, [location.pathname]);

    const setTabRef = (id: string, el: HTMLAnchorElement | null) => {
      if (el) tabRefs.current.set(id, el);
      else tabRefs.current.delete(id);
    };

    const userInitial = (fullName || user?.email || 'U').charAt(0).toUpperCase();

    const isTauriApp = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

    return (
        <nav
            className={cn(
                "h-16 border-b border-border px-6 flex items-center sticky top-0 z-50 shrink-0",
                isTauriApp ? "bg-white" : "bg-white/80 backdrop-blur-md"
            )}
        >
            {/* LEFT: Logo */}
            <div className="flex items-center shrink-0">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            {/* DRAG SPACER */}
            <div
                {...(isTauriApp ? { 'data-tauri-drag-region': true } : {})}
                className="flex-1 min-w-[16px] h-full"
            />
            
            {/* MIDDLE: Navigation Tabs with Animated Pill */}
            <div className="hidden md:flex justify-center shrink-0">
                <div
                    ref={containerRef}
                    className="relative flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50"
                >
                    {/* Animated pill indicator */}
                    <div
                        className="absolute top-1 bottom-1 rounded-full bg-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{
                            left: `${pill.left}px`,
                            width: `${pill.width}px`,
                            opacity: mounted ? 1 : 0,
                        }}
                    />

                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.id}
                                ref={(el) => setTabRef(tab.id, el)}
                                to={tab.path}
                                className={cn(
                                    "relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* DRAG SPACER */}
            <div
                {...(isTauriApp ? { 'data-tauri-drag-region': true } : {})}
                className="flex-1 min-w-[16px] h-full"
            />

            {/* RIGHT: User Actions */}
            <div className="flex items-center justify-end gap-3 w-auto min-w-[200px]">
                {!user ? (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAuthModalOpen(true)}
                        className="text-[13px] font-bold h-9 px-5 rounded-full hover:bg-muted"
                    >
                        Sign In
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all duration-200 group">
                                <Avatar className="w-9 h-9 border border-border shadow-sm group-hover:opacity-90 transition relative overflow-hidden">
                                    <AvatarImage src={avatarUrl || undefined} />
                                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                                        {userInitial}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-1 p-1 rounded-xl shadow-xl border-border/40">
                            <DropdownMenuLabel className="px-3 py-2">
                                <div className="flex flex-col space-y-0.5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Account</p>
                                    <p className="text-sm font-bold truncate text-zinc-950">{fullName || user.email}</p>
                                    {fullName && <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => setProfileModalOpen(true)}
                                className="rounded-lg py-2 cursor-pointer"
                            >
                                <UserIcon className="mr-2 h-4 w-4 text-primary" />
                                <span className="font-medium">Profile Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => signOut()}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg py-2 cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="font-medium">Log Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </nav>
    );
};
