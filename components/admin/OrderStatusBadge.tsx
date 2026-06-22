export function OrderStatusBadge({ status }: { status: string }) {
  return <span className="rounded-brand bg-brand-ivory px-2 py-1 text-xs uppercase">{status}</span>;
}
