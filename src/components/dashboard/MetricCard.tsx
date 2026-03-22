interface MetricCardProps {
  title: string;
  value: string;
}

export default function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_24px_48px_-12px_rgba(0,20,83,0.04)] hover:shadow-[0_24px_48px_-8px_rgba(0,20,83,0.08)] transition-shadow">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2 font-sans">
        {title}
      </h3>
      <div className="text-4xl font-display font-light text-on-surface">
        {value}
      </div>
    </div>
  );
}
