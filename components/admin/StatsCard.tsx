export function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-brand-lg bg-brand-white p-4 shadow-card">
      <p className="text-xs uppercase text-brand-muted">{label}</p>
      <p className="mt-2 text-heading-sm font-heading">{value}</p>
    </div>
  );
}
