const recentActivity = [
  { id: 1, vendor: 'Acme Corp', status: 'Active', date: 'Oct 24, 2026', amount: '$4,200' },
  { id: 2, vendor: 'Global Supplies', status: 'Pending', date: 'Oct 23, 2026', amount: '$1,850' },
  { id: 3, vendor: 'Techtronics', status: 'Active', date: 'Oct 23, 2026', amount: '$12,400' },
  { id: 4, vendor: 'Beta Industries', status: 'Inactive', date: 'Oct 20, 2026', amount: '$0' },
];

export default function ActivityTable() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(0,20,83,0.04)] overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant/10">
        <h2 className="text-[1.125rem] font-semibold text-on-surface">Recent Vendor Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sans">Vendor Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sans">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sans">Last Update</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sans">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentActivity.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-4 text-on-surface font-medium border-t border-outline-variant/10">{row.vendor}</td>
                <td className="px-6 py-4 border-t border-outline-variant/10">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    row.status === 'Active' ? 'bg-positive/10 text-positive' :
                    row.status === 'Pending' ? 'bg-[#e28743]/10 text-[#e28743]' :
                    'bg-error/10 text-error'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant border-t border-outline-variant/10">{row.date}</td>
                <td className="px-6 py-4 text-on-surface font-medium border-t border-outline-variant/10">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
