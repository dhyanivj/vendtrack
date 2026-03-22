'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  phone: string;
  name: string;
  cardLast4: string;
  dailyLimit: number;
  monthlyLimit: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, passkey: string) => Promise<void>;
  signup: (name: string, phone: string, cardLast4: string, passkey: string) => Promise<void>;
  logout: () => void;
  updateLimits: (dailyLimit: number, monthlyLimit: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedPhone = localStorage.getItem('vendtrack_user_phone');
        if (storedPhone) {
          const userDoc = await getDoc(doc(db, 'users', storedPhone));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              phone: storedPhone,
              name: data.name,
              cardLast4: data.cardLast4,
              dailyLimit: data.dailyLimit,
              monthlyLimit: data.monthlyLimit,
            });
          } else {
            localStorage.removeItem('vendtrack_user_phone');
          }
        }
      } catch (error) {
        console.error("Error hydrating auth:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Protected Routes enforcement
  useEffect(() => {
    if (!loading) {
      const isAuthRoute = pathname === '/login' || pathname === '/signup';
      if (!user && !isAuthRoute) {
        router.push('/login');
      } else if (user && isAuthRoute) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (phone: string, passkey: string) => {
    const userDoc = await getDoc(doc(db, 'users', phone));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    const data = userDoc.data();
    if (data.passkey !== passkey) {
      throw new Error('Incorrect passkey');
    }
    setUser({
      phone,
      name: data.name,
      cardLast4: data.cardLast4,
      dailyLimit: data.dailyLimit,
      monthlyLimit: data.monthlyLimit,
    });
    localStorage.setItem('vendtrack_user_phone', phone);
    router.push('/');
  };

  const signup = async (name: string, phone: string, cardLast4: string, passkey: string) => {
    const userRef = doc(db, 'users', phone);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      throw new Error('Phone number already registered');
    }
    
    const newUser = {
      name,
      phone,
      cardLast4,
      passkey,
      dailyLimit: 100,
      monthlyLimit: 800,
      createdAt: serverTimestamp()
    };
    
    await setDoc(userRef, newUser);
    
    setUser({
      phone,
      name,
      cardLast4,
      dailyLimit: 100,
      monthlyLimit: 800
    });
    localStorage.setItem('vendtrack_user_phone', phone);
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vendtrack_user_phone');
    router.push('/login');
  };

  const updateLimits = async (dailyLimit: number, monthlyLimit: number) => {
    if (!user) throw new Error('Not authenticated');
    const userRef = doc(db, 'users', user.phone);
    await updateDoc(userRef, { dailyLimit, monthlyLimit });
    setUser({ ...user, dailyLimit, monthlyLimit });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateLimits }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
