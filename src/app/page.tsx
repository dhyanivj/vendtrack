'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [dailySpent, setDailySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.phone),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: any[] = [];
      let daily = 0;
      let monthly = 0;
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      snapshot.forEach(doc => {
        const data = doc.data();
        txs.push({ id: doc.id, ...data });

        if (data.timestamp) {
          const txTime = data.timestamp.toDate().getTime();
          if (txTime >= today) daily += data.amount;
          if (txTime >= firstOfMonth) monthly += data.amount;
        }
      });
      
      setTransactions(txs);
      setDailySpent(daily);
      setMonthlySpent(monthly);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  const dailyPercent = Math.min((dailySpent / user.dailyLimit) * 100, 100);
  const monthlyPercent = Math.min((monthlySpent / user.monthlyLimit) * 100, 100);
  
  const getIcon = (category: string) => {
    switch(category) {
      case 'chips': return 'fastfood';
      case 'drinks': return 'local_drink';
      case 'biscuits': return 'cookie';
      case 'chocolates': return 'cake';
      default: return 'more_horiz';
    }
  };

  const getRelativeTime = (date: Date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMins < 60) return `${diffInMins}m ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <main className="pt-24 pb-8 px-6 max-w-2xl mx-auto">
      {/* Dashboard Welcome */}
      <section className="mb-10">
        <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-primary mb-1">Status: Active</p>
        <h2 className="text-4xl font-extrabold tracking-tight leading-tight">Welcome, {user.name.split(' ')[0]}.</h2>
      </section>

      {/* Digital Vending Card */}
      <div className="relative w-full aspect-[1.586/1] rounded-xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-2xl overflow-hidden group mb-12">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="90" cy="10" fill="currentColor" r="40"></circle>
            <circle cx="10" cy="90" fill="currentColor" r="30"></circle>
          </svg>
        </div>
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-label text-[10px] uppercase tracking-widest opacity-80">Card Member</span>
              <span className="font-bold text-lg">{user.name}</span>
            </div>
            <span className="material-symbols-outlined text-3xl" data-icon="contactless">contactless</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label text-[10px] uppercase tracking-widest opacity-80">Card Number</span>
            <span className="font-headline text-2xl tracking-[0.2em] font-medium">•••• •••• •••• {user.cardLast4}</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="font-label text-[10px] uppercase tracking-widest opacity-80">Status</span>
                <span className="font-medium text-sm">Active</span>
              </div>
            </div>
            <div className="text-2xl font-black italic tracking-tighter">VENDTRACK</div>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        {/* Daily Pulse Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyPercent >= 90 ? 'bg-red-500/10 text-red-500' : dailyPercent >= 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <span className="material-symbols-outlined text-lg" data-icon="bolt">bolt</span>
              </div>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Today</h3>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-container" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeDasharray={`${dailyPercent}, 100`} strokeLinecap="round" className={`transition-all duration-1000 ${dailyPercent >= 90 ? 'stroke-red-500' : dailyPercent >= 70 ? 'stroke-amber-500' : 'stroke-emerald-500'}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-extrabold ${dailyPercent >= 90 ? 'text-red-500' : dailyPercent >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>{Math.round(dailyPercent)}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold tracking-tight">₹{dailySpent}</span>
                <span className="text-xs text-on-surface-variant font-medium">of ₹{user.dailyLimit} limit</span>
                <span className={`text-[11px] font-bold mt-1 ${dailyPercent >= 90 ? 'text-red-500' : 'text-on-surface-variant'}`}>₹{Math.max(user.dailyLimit - dailySpent, 0)} left</span>
              </div>
            </div>
          </div>
          <div className={`absolute top-0 right-0 w-28 h-28 rounded-full -mr-14 -mt-14 opacity-[0.04] group-hover:scale-125 transition-transform duration-700 ${dailyPercent >= 90 ? 'bg-red-500' : dailyPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
        </div>

        {/* Monthly Cap Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${monthlyPercent >= 90 ? 'bg-red-500/10 text-red-500' : monthlyPercent >= 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-lg" data-icon="calendar_month">calendar_month</span>
              </div>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">This Month</h3>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-container" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeDasharray={`${monthlyPercent}, 100`} strokeLinecap="round" className={`transition-all duration-1000 ${monthlyPercent >= 90 ? 'stroke-red-500' : monthlyPercent >= 70 ? 'stroke-amber-500' : 'stroke-primary'}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-extrabold ${monthlyPercent >= 90 ? 'text-red-500' : monthlyPercent >= 70 ? 'text-amber-500' : 'text-primary'}`}>{Math.round(monthlyPercent)}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold tracking-tight">₹{monthlySpent}</span>
                <span className="text-xs text-on-surface-variant font-medium">of ₹{user.monthlyLimit} limit</span>
                <span className={`text-[11px] font-bold mt-1 ${monthlyPercent >= 90 ? 'text-red-500' : 'text-on-surface-variant'}`}>₹{Math.max(user.monthlyLimit - monthlySpent, 0)} left</span>
              </div>
            </div>
          </div>
          <div className={`absolute top-0 right-0 w-28 h-28 rounded-full -mr-14 -mt-14 opacity-[0.04] group-hover:scale-125 transition-transform duration-700 ${monthlyPercent >= 90 ? 'bg-red-500' : monthlyPercent >= 70 ? 'bg-amber-500' : 'bg-primary'}`}></div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold tracking-tight">Recent Spends</h3>
          <Link href="/history" className="text-primary text-sm font-semibold cursor-pointer hover:underline underline-offset-4">
            View All
          </Link>
        </div>
        
        {transactions.length === 0 ? (
          <div className="bg-surface-container-low p-8 rounded-xl text-center text-on-surface-variant">
            No transactions yet. Add a spend to see it here!
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-lg text-primary">
                    <span className="material-symbols-outlined" data-icon={getIcon(tx.category)}>{getIcon(tx.category)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface capitalize">{tx.category}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {tx.timestamp ? getRelativeTime(tx.timestamp.toDate()) : 'Just now'}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-on-surface text-lg">-₹{tx.amount}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Component */}
      <div className="mt-12 p-1 bg-gradient-to-r from-primary to-primary-container rounded-xl">
        <Link href="/add" className="w-full bg-surface-container-lowest py-4 px-6 rounded-[calc(0.75rem-1px)] flex items-center justify-between group">
          <span className="font-bold text-primary group-hover:translate-x-1 transition-transform">Add new transaction</span>
          <span className="material-symbols-outlined text-primary">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
