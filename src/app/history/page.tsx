'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function History() {
  const { user } = useAuth();
  const [groupedTxs, setGroupedTxs] = useState<{ label: string; items: any[] }[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.phone),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let monthly = 0;
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      
      const groups: { [key: string]: any[] } = {
        'Today': [],
        'Yesterday': [],
        'Older': []
      };

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterday = today - 86400000;

      snapshot.forEach(d => {
        const data = d.data();
        const tx = { id: d.id, ...data };
        
        if (data.timestamp) {
          const date = data.timestamp.toDate();
          const ms = date.getTime();
          
          if (ms >= firstOfMonth) {
            monthly += data.amount;
          }

          if (ms >= today) {
            groups['Today'].push(tx);
          } else if (ms >= yesterday) {
            groups['Yesterday'].push(tx);
          } else {
            groups['Older'].push(tx);
          }
        }
      });
      
      const orderedGroups = [
        { label: 'Today', items: groups['Today'] },
        { label: 'Yesterday', items: groups['Yesterday'] },
        { label: 'Older', items: groups['Older'] },
      ].filter(g => g.items.length > 0);

      setGroupedTxs(orderedGroups);
      setMonthlyTotal(monthly);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  const getIcon = (category: string) => {
    switch(category) {
      case 'chips': return 'fastfood';
      case 'drinks': return 'local_drink';
      case 'biscuits': return 'cookie';
      case 'chocolates': return 'cake';
      default: return 'more_horiz';
    }
  };

  const getTimeOnly = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async (txId: string) => {
    if (deletingId) return;
    setDeletingId(txId);
    try {
      await deleteDoc(doc(db, 'transactions', txId));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const overBudget = monthlyTotal > user.monthlyLimit;

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      {/* Monthly Summary Hero */}
      <section className="mb-12 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Total spent this month</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-extrabold tracking-tighter text-on-surface">₹{monthlyTotal.toLocaleString()}</h2>
          </div>
        </div>
        
        {/* Visual Kinetic Signal Area */}
        <div className={`mt-8 h-24 w-full rounded-xl relative overflow-hidden flex items-end p-6 ${overBudget ? 'bg-gradient-to-r from-error to-red-400' : 'bg-gradient-to-r from-primary to-primary-container'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-surface-container-lowest text-7xl" data-icon="receipt_long">receipt_long</span>
          </div>
          <p className="text-surface-container-lowest font-medium text-sm z-10">
            {overBudget
              ? `⚠ You've exceeded your monthly limit of ₹${user.monthlyLimit}!`
              : `You're staying securely inside your monthly limit of ₹${user.monthlyLimit}.`
            }
          </p>
        </div>
      </section>

      {/* Chronological List */}
      <div className="space-y-10">
        {groupedTxs.length === 0 ? (
          <div className="text-center text-on-surface-variant font-medium py-12">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">receipt_long</span>
            No transactions yet. Start by adding a spend!
          </div>
        ) : (
          groupedTxs.map(group => (
            <section key={group.label}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-6 flex items-center gap-4">
                {group.label}
                <div className="flex-grow h-[1px] bg-surface-container"></div>
                <span className="text-on-surface-variant">{group.items.length}</span>
              </h3>
              <div className="space-y-4">
                {group.items.map(tx => (
                  <div key={tx.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between transition-all hover:bg-surface-bright active:scale-[0.98] duration-150 group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" data-icon={getIcon(tx.category)}>{getIcon(tx.category)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface tracking-tight capitalize">{tx.category}</p>
                        <p className="text-xs text-on-surface-variant uppercase">
                          {tx.timestamp ? getTimeOnly(tx.timestamp.toDate()) : '--:--'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-on-surface">-₹{tx.amount}</p>
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity text-error/60 hover:text-error p-1 rounded-lg hover:bg-error/10 active:scale-90 disabled:opacity-50"
                        title="Delete transaction"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
