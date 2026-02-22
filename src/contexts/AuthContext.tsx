/* eslint-disable */
// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: any;
    profile: any;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<any>;
    signIn: (email: string, password: string) => Promise<any>;
    signInWithPhone: (phone: string) => Promise<any>;
    verifyOtp: (phone: string, token: string) => Promise<any>;
    signInWithGoogle: () => Promise<any>;
    signInWithLine: () => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        setProfile(data);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        if (error) throw error;

        // Create profile
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                name,
                avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
                crops: [],
                certification_status: 'none'
            });
        }
        return data;
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signInWithPhone = async (phone: string) => {
        const { data, error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        return data;
    };

    const verifyOtp = async (phone: string, token: string) => {
        const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
        if (error) throw error;
        return data;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return data;
    };

    const signInWithLine = async () => {
        // LINE uses custom OIDC provider in Supabase
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google', // LINE requires custom setup; use placeholder
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithPhone, verifyOtp, signInWithGoogle, signInWithLine, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
