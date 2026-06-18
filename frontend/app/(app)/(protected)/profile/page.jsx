"use client";
import { useAuth } from "@/context/AuthContext";
import { motion } from 'framer-motion';
import { Camera, Pencil, Mail, Trophy, Star } from 'lucide-react';
import { useState } from 'react';

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
    const { user, stats } = useAuth();
    const [isOpenChangeUserName, setIsOpenChangeUserName] = useState(false);

    const profile = {
        name: user,
        level: stats.level,
        total_xp: stats.total_xp,
        progress_in_level: stats.progress_in_level,
        xp_per_level: stats.xp_per_level,
        xp_to_next_level: stats.xp_to_next_level,
    };

    const progressPercent = stats.xp_per_level > 0
        ? Math.min(100, (stats.progress_in_level / stats.xp_per_level) * 100)
        : 0;

    const xpToNextLevel = stats.xp_to_next_level || 0;

    return (
        <div className="flex min-h-[80vh] bg-slate-50 items-center justify-center p-4">
            <ChangeUserName isOpenChangeUserName={isOpenChangeUserName} setIsOpenChangeUserName={setIsOpenChangeUserName} />
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
                                    {user?.split(' ').map(n => n[0]).join('') || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <label className="absolute bottom-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors" aria-label="Cambiar foto de perfil">
                                <Camera className="size-4" />
                                <input type="file" accept="image/*" className="hidden" aria-hidden="true" />
                            </label>
                        </div>
                    </motion.div>

                    <CardContent className="px-6 py-6 space-y-6">
                        {/* Name and Email */}
                        <motion.div variants={itemVariants} className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {user || "Usuario"}
                                </h1>
                                <button onClick={() => setIsOpenChangeUserName(true)} className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Editar nombre de usuario">
                                    <Pencil className="size-3.5" />
                                </button>
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
                                <span>{stats.progress_in_level} / {stats.xp_per_level || '—'} XP</span>
                                <span>{xpToNextLevel} XP al Nv {stats.level + 1}</span>
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
                                            {stats.level}
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
                                            {stats.total_xp.toLocaleString("es-ES")}
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