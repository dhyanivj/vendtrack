'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.length !== 4) {
      setError('Passkey must be exactly 4 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(name, phone, cardLast4, passkey);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#a73a00] to-[#ff5c00] flex flex-col relative overflow-hidden">
      {/* Top Section */}
      <div className="pt-12 px-6 flex flex-col relative z-10 pb-4">
        <div className="text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight">VendTrack</h1>
          <p className="text-white/60 text-xs font-semibold mt-2 uppercase tracking-[0.3em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>by Vijay Dhyani</p>
        </div>
      </div>

      {/* Bottom Card Section */}
      <div className="bg-surface w-full rounded-t-[2.5rem] px-8 pt-6 pb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative z-20 flex-1 flex flex-col mt-2">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-on-surface mb-1 tracking-tight">Create Account</h2>
          <p className="text-on-surface-variant font-medium text-sm">Join the intelligent impulse</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 flex-1">
          {error && <p className="text-error text-sm font-bold text-center bg-error/10 py-3 rounded-xl">{error}</p>}
          
          <div className="relative border border-outline-variant/70 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:ring-1 ring-primary transition-all bg-surface-container-lowest">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 block mb-0.5 tracking-wider">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-transparent outline-none font-bold text-base text-on-surface placeholder:text-outline-variant"
              placeholder="e.g. Alex Carter"
              required
            />
          </div>

          <div className="relative border border-outline-variant/70 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:ring-1 ring-primary transition-all bg-surface-container-lowest">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 block mb-0.5 tracking-wider">Phone Number</label>
            <input 
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-transparent outline-none font-bold text-base text-on-surface placeholder:text-outline-variant"
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div className="relative border border-outline-variant/70 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:ring-1 ring-primary transition-all bg-surface-container-lowest">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 block mb-0.5 tracking-wider">Card Last 4 Digits</label>
            <input 
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={cardLast4}
              onChange={e => setCardLast4(e.target.value)}
              className="w-full bg-transparent outline-none font-bold text-base text-on-surface placeholder:text-outline-variant tracking-widest"
              placeholder="1234"
              required
            />
          </div>

          <div className="relative border border-outline-variant/70 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:ring-1 ring-primary transition-all bg-surface-container-lowest flex items-center justify-between">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 block mb-0.5 tracking-wider">Create Passkey</label>
              <input 
                type={showPasskey ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
                className={`w-full bg-transparent outline-none font-bold text-base text-on-surface placeholder:text-outline-variant ${!showPasskey && passkey ? 'tracking-[0.4em]' : ''}`}
                placeholder="••••"
                required
              />
            </div>
            <button 
              type="button" 
              onClick={() => setShowPasskey(!showPasskey)}
              className="text-on-surface-variant ml-2 p-1 active:scale-95 transition-transform opacity-60 hover:opacity-100"
            >
              <span className="material-symbols-outlined">{showPasskey ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>

          <div className="pt-4 pb-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all text-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Register Account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-base font-semibold text-on-surface-variant">
            Already a member? <Link href="/login" className="text-primary font-bold text-lg hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
