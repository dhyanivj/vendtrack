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

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Daily Pulse Card */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Daily Pulse</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold">{dailySpent}</span>
              <span className="text-gray-400 font-medium">/ ₹{user.dailyLimit}</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden mt-6">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-1000" style={{ width: `${dailyPercent}%` }}></div>
            </div>
          </div>
          {/* Kinetic Background Element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        {/* Monthly Cap Card */}
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Monthly Cap</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold">{monthlySpent}</span>
            <span className="text-gray-400 font-medium">/ ₹{user.monthlyLimit}</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden mt-6">
            <div className="h-full bg-on-surface transition-all duration-1000" style={{ width: `${monthlyPercent}%` }}></div>
          </div>
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
