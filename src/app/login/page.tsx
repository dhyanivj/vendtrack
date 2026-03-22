'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, passkey);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#a73a00] to-[#ff5c00] flex flex-col relative overflow-hidden">
      {/* Top Section */}
      <div className="pt-16 px-6 flex flex-col flex-1 relative z-10 justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-extrabold tracking-tight">VendTrack</h1>
          <p className="text-white/60 text-xs font-semibold mt-2 uppercase tracking-[0.3em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>by Vijay Dhyani</p>
        </div>
      </div>

      {/* Bottom Card Section */}
      <div className="bg-surface w-full rounded-t-[2.5rem] px-8 pt-8 pb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative z-20 flex-grow-0">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-on-surface mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-on-surface-variant font-medium text-sm">Enter your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-error text-sm font-bold text-center bg-error/10 py-3 rounded-xl">{error}</p>}

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

          <div className="relative border border-outline-variant/70 rounded-2xl px-5 py-3 focus-within:border-primary focus-within:ring-1 ring-primary transition-all bg-surface-container-lowest flex items-center justify-between">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 block mb-0.5 tracking-wider">4-Digit Passkey</label>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all text-lg disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button className="text-on-surface-variant font-medium text-sm hover:text-primary transition-colors">
            Forgot your passkey?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-base font-semibold text-on-surface-variant">
            Don't have an account? <Link href="/signup" className="text-primary font-bold text-lg hover:underline">Get Started</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
