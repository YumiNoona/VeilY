import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import {
    MessagesSquare,
    LayoutGrid,
    Sparkles,
    MessageCircleMore,
    User as UserIcon,
    LogOut,
    CirclePlay,
    Mail,
    Video,
    ChevronDown,
    Heart
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

export const Navbar = () => {
    const location = useLocation();
    const { 
        user, 
        signOut, 
        setProfileModalOpen,
        setAuthModalOpen,
        setSupportModalOpen,
        fullName,
        avatarUrl 
    } = useAuth();

    const tabs = [
        { id: "chat", label: "Chat", path: "/app", icon: MessagesSquare },
        { id: "ai-chat", label: "AI Chat", path: "/app/ai-chat", icon: Sparkles },
        { id: "social", label: "Social", path: "/app/social", icon: LayoutGrid },
        { id: "comments", label: "Comments", path: "/app/comments", icon: MessageCircleMore },
        { id: "stories", label: "Stories", path: "/app/stories", icon: CirclePlay },
        { id: "email", label: "Email", path: "/app/email", icon: Mail },
        { id: "group-call", label: "Call", path: "/app/group-call", icon: Video },
    ];

    const activeIndex = tabs.findIndex(t => t.path === location.pathname);
    const activeTab = tabs[activeIndex] || tabs[0];

    const userInitial = (fullName || user?.email || 'U').charAt(0).toUpperCase();
    const ActiveIcon = activeTab.icon;

    const isTauriApp = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;

    return (
        <nav
            className={cn(
                "h-16 border-b border-border px-4 sm:px-6 flex items-center sticky top-0 z-50 shrink-0",
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
            
            {/* MIDDLE: Navigation Tabs */}
            <div className="hidden lg:flex justify-center shrink-0">
                <div className="relative flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={cn(
                                    "relative flex items-center gap-2 whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
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

            <div className="lg:hidden shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 rounded-full border-border/70 bg-white px-3 text-[13px] font-semibold shadow-sm"
                            aria-label={`Switch editor, current editor is ${activeTab.label}`}
                        >
                            <ActiveIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">{activeTab.label}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 rounded-xl p-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = location.pathname === tab.path;
                            return (
                                <DropdownMenuItem key={tab.id} asChild className="rounded-lg p-0">
                                    <Link
                                        to={tab.path}
                                        className={cn(
                                            "flex w-full items-center gap-3 px-3 py-2.5 text-sm",
                                            isActive && "bg-muted font-semibold"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* DRAG SPACER */}
            <div
                {...(isTauriApp ? { 'data-tauri-drag-region': true } : {})}
                className="flex-1 min-w-[16px] h-full"
            />

            {/* RIGHT: User Actions */}
            <div className="flex items-center justify-end gap-3 w-auto min-w-0 lg:min-w-[200px]">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSupportModalOpen(true)}
                    className="h-9 rounded-full border-rose-200 bg-rose-50 px-3 text-rose-600 shadow-sm hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700"
                    aria-label="Support Veily"
                >
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="hidden xl:inline">Donate</span>
                </Button>
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
