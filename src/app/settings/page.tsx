'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Settings() {
  const { user, logout, updateLimits } = useAuth();
  const [dailySpent, setDailySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);

  // Edit Limits State
  const [editingLimits, setEditingLimits] = useState(false);
  const [editDaily, setEditDaily] = useState('');
  const [editMonthly, setEditMonthly] = useState('');
  const [savingLimits, setSavingLimits] = useState(false);

  // Notification State
  const [notifyOverBudget, setNotifyOverBudget] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.phone)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let daily = 0;
      let monthly = 0;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.timestamp) {
          const txTime = data.timestamp.toDate().getTime();
          if (txTime >= today) daily += data.amount;
          if (txTime >= firstOfMonth) monthly += data.amount;
        }
      });
      setDailySpent(daily);
      setMonthlySpent(monthly);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  const dailyPercent = Math.min((dailySpent / user.dailyLimit) * 100, 100);
  const monthlyPercent = Math.min((monthlySpent / user.monthlyLimit) * 100, 100);

  const handleEditLimits = () => {
    setEditDaily(String(user.dailyLimit));
    setEditMonthly(String(user.monthlyLimit));
    setEditingLimits(true);
  };

  const handleSaveLimits = async () => {
    const d = Number(editDaily);
    const m = Number(editMonthly);
    if (!d || !m || d <= 0 || m <= 0) return;
    setSavingLimits(true);
    try {
      await updateLimits(d, m);
      setEditingLimits(false);
    } catch (err) {
      console.error('Failed to update limits', err);
    } finally {
      setSavingLimits(false);
    }
  };

  return (
    <main className="pt-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-32">
      {/* Left Column: The Vending Card */}
      <section className="md:col-span-5 lg:col-span-4">
        <div className="sticky top-28">
          <h2 className="font-headline font-extrabold text-3xl mb-8 tracking-tight">Account</h2>
          
          {/* Digital Vending Card */}
          <div className="relative w-full aspect-[1.586/1] rounded-xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-2xl overflow-hidden group">
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

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Phone ID</span>
              <span className="text-xl font-bold">{user.phone}</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Security</span>
              <span className="text-xl font-bold">Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Limits & Settings */}
      <section className="md:col-span-7 lg:col-span-8 space-y-12">
        {/* Budget Limits Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl">Budget Controls</h3>
            {!editingLimits ? (
              <button onClick={handleEditLimits} className="text-primary font-semibold text-sm cursor-pointer hover:underline">
                Edit Limits
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditingLimits(false)} className="text-on-surface-variant font-semibold text-sm hover:underline">Cancel</button>
                <button onClick={handleSaveLimits} disabled={savingLimits} className="text-primary font-semibold text-sm hover:underline disabled:opacity-50">
                  {savingLimits ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Daily Limit */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Daily Limit</p>
                  {editingLimits ? (
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg text-on-surface-variant">₹</span>
                      <input
                        type="number"
                        value={editDaily}
                        onChange={e => setEditDaily(e.target.value)}
                        className="text-2xl font-bold text-on-surface bg-transparent outline-none border-b-2 border-primary w-24"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-on-surface">₹{user.dailyLimit}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-on-surface-variant">₹{dailySpent} spent</p>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${dailyPercent}%` }}></div>
              </div>
            </div>
            
            {/* Monthly Limit */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Monthly Limit</p>
                  {editingLimits ? (
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg text-on-surface-variant">₹</span>
                      <input
                        type="number"
                        value={editMonthly}
                        onChange={e => setEditMonthly(e.target.value)}
                        className="text-2xl font-bold text-on-surface bg-transparent outline-none border-b-2 border-primary w-24"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-on-surface">₹{user.monthlyLimit}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-on-surface-variant">₹{monthlySpent} spent</p>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full transition-all duration-1000" style={{ width: `${monthlyPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xl mb-6">Preferences</h3>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden divide-y divide-outline-variant/10">
            {/* Over-budget Alert */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" data-icon="warning">warning</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Over-budget Alert</p>
                  <p className="text-xs text-on-surface-variant">Get notified when you exceed your limit</p>
                </div>
              </div>
              <button
                onClick={() => setNotifyOverBudget(!notifyOverBudget)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${notifyOverBudget ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${notifyOverBudget ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>

            {/* Daily Summary */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Daily Summary</p>
                  <p className="text-xs text-on-surface-variant">Receive a daily spending digest</p>
                </div>
              </div>
              <button
                onClick={() => setNotifyDaily(!notifyDaily)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${notifyDaily ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${notifyDaily ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          {/* Danger Zone / Sign Out */}
          <div className="pt-8">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-error/20 text-error font-bold hover:bg-error/5 transition-colors active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined" data-icon="logout">logout</span>
              Sign Out
            </button>
            <p className="text-center text-[10px] text-on-surface-variant mt-4 font-bold uppercase tracking-widest">App Version 2.4.0 • Built for VendTrack</p>
          </div>
        </div>
      </section>
    </main>
  );
}
