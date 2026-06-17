"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Pencil, Mail, Trophy, Star } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { API_URL, headers, handleResponse } from "@/services/httpClient";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChangeUserName } from '@/components/profile/userName';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


export default function ProfilePage() {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpenChangeUserName, setIsOpenChangeUserName] = useState(false);

    const getProfile = async () => {
        if (!token) return;
        try {
            const data = await handleResponse(
                await fetch(`${API_URL}/me/profile`, {
                    method: 'GET',
                    headers: headers(token),
                })
            );
            setProfile(data);
        } catch {
            // Si falla, mantenemos el estado anterior
        }
        setLoading(false);
    }

    useEffect(() => {
        getProfile()
    }, [token]);

    if (loading) return null;

    const progressPercent = profile
        ? Math.min(100, (profile.progress_in_level / profile.xp_per_level) * 100)
        : 0;

    const xpToNextLevel = profile
        ? Math.max(0, (profile.xp_per_level || 500) - (profile.progress_in_level || 0))
        : 0;

    return (
        <div className="flex min-h-[80vh] bg-slate-50 items-center justify-center p-4">
            <ChangeUserName isOpenChangeUserName={isOpenChangeUserName} setIsOpenChangeUserName={setIsOpenChangeUserName} token={token} profile={profile} setProfile={setProfile}/>
            <motion.div
                className="w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="w-full shadow-lg overflow-hidden">
                    <motion.div variants={itemVariants} className="flex justify-center pt-10 pb-6">
                        <div className="relative">
                            <Avatar className="h-52 w-52 border-4 border-background shadow-xl">
                                <AvatarFallback className="text-4xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                                    {profile?.name?.split(' ').map(n => n[0]).join('') || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <label className="absolute bottom-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                                <Camera className="size-4" />
                                <input type="file" accept="image/*" className="hidden" />
                            </label>
                        </div>
                    </motion.div>

                    <CardContent className="px-6 py-6 space-y-6">
                        {/* Name and Email */}
                        <motion.div variants={itemVariants} className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {profile?.name || "Usuario"}
                                </h1>
                                <button onClick={() => setIsOpenChangeUserName(true)} className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                    <Pencil className="size-3.5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                                <Mail className="size-3.5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{profile?.email || ""}</p>
                            </div>
                        </motion.div>

                        {/* XP Progress Bar */}
                        <motion.div variants={itemVariants}>
                            <div className="h-3 w-full rounded-full bg-amber-500/20 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                                <span>{profile?.progress_in_level || 0} / {profile?.xp_per_level || 500} XP</span>
                                <span>{xpToNextLevel} XP al Nv {(profile?.level || 1) + 1}</span>
                            </div>
                        </motion.div>

                        {/* Level & XP Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                                        <Trophy className="size-6 text-amber-500" />
                                        <span className="text-3xl font-bold tracking-tight">
                                            {profile?.level || "1"}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            Nivel
                                        </span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                                        <Star className="size-6 text-amber-500 fill-amber-500" />
                                        <span className="text-3xl font-bold tracking-tight">
                                            {(profile?.total_xp ?? 0).toLocaleString("es-ES")}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            XP Total
                                        </span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
