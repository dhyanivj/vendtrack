'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 'chips', label: 'Chips', icon: 'fastfood' },
  { id: 'drinks', label: 'Drinks', icon: 'local_drink' },
  { id: 'biscuits', label: 'Biscuits', icon: 'cookie' },
  { id: 'chocolates', label: 'Chocolates', icon: 'cake' },
  { id: 'others', label: 'Others', icon: 'more_horiz' },
];

export default function AddSpend() {
  const { user } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleSave = async () => {
    if (!user) return;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.phone,
        amount: Number(amount),
        category,
        timestamp: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => router.push('/'), 800);
    } catch (err: any) {
      console.error("Error adding transaction: ", err);
      setError('Failed to save transaction. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      {/* Editorial Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface leading-tight mb-2">
          What did you <br/>
          <span className="text-primary italic">spend?</span>
        </h1>
        <p className="text-on-surface-variant/70 font-medium">Capture your inventory costs instantly.</p>
      </div>

      {/* Input Section */}
      <div className="space-y-8">
        {error && (
          <div className="flex items-center gap-3 text-error text-sm font-bold bg-error/10 py-3 px-4 rounded-xl">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 text-green-700 text-sm font-bold bg-green-50 py-3 px-4 rounded-xl">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Transaction saved! Redirecting...
          </div>
        )}
        
        {/* Amount Input */}
        <div className="relative group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block ml-1">Total Amount</label>
          <div className="flex items-baseline gap-2 bg-surface-container-low rounded-xl p-8 transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/20">
            <span className="text-4xl font-bold text-on-surface-variant opacity-40">₹</span>
            <input 
              className="bg-transparent border-none p-0 text-6xl font-black tracking-tighter w-full focus:ring-0 text-on-surface placeholder:text-surface-container-highest outline-none" 
              type="number" 
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
            />
          </div>
        </div>

        {/* Bento Category Grid */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 block ml-1">Category</label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              const isOthers = cat.id === 'others';
              return (
                <button 
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setError('');
                  }}
                  className={`flex ${isOthers ? 'col-span-2 items-center flex-row gap-3' : 'flex-col items-center'} justify-center p-4 rounded-xl transition-all active:scale-95 ${
                    isSelected 
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span 
                    className={`material-symbols-outlined ${!isOthers ? 'mb-2' : ''}`} 
                    data-icon={cat.icon}
                    style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-bold uppercase">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Display */}
        <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-primary" data-icon="calendar_today">calendar_today</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 block">Transaction Date</span>
              <span className="font-bold text-on-surface">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <span>{loading ? 'Saving...' : success ? 'Saved ✓' : 'Save Transaction'}</span>
            {!loading && !success && <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>}
          </button>
          <p className="text-center mt-6 text-on-surface-variant/40 text-xs font-medium tracking-wide">ENTRY WILL BE SAVED TO DASHBOARD HISTORY</p>
        </div>
      </div>
    </main>
  );
}
