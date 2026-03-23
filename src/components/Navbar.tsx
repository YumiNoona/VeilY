import React from 'react';
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
    Crown, 
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

export const Navbar = () => {
    const location = useLocation();
    const { 
        user, 
        plan, 
        setUpgradeModalOpen, 
        signOut, 
        setProfileModalOpen,
        setAuthModalOpen,
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

    const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <nav className="h-16 border-b border-border bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shrink-0">
            {/* LEFT: Logo */}
            <div className="flex items-center w-[200px]">
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            
            {/* MIDDLE: Navigation Tabs */}
            <div className="hidden md:flex flex-1 justify-center">
                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
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
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: User Actions */}
            <div className="flex items-center justify-end gap-3 w-[200px]">
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
                    <div className="flex items-center gap-3">
                        {plan === 'free' && (
                            <Button 
                                size="sm" 
                                onClick={() => setUpgradeModalOpen(true)}
                                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-md gap-2 h-9 px-4 rounded-full text-[13px] font-bold"
                            >
                                <Crown className="w-3.5 h-3.5" />
                                Upgrade
                            </Button>
                        )}
                        
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
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account</p>
                                        <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
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
                    </div>
                )}
            </div>
        </nav>
    );
};
