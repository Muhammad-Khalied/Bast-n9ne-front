export function Toast({ message }: { message: string }) {
  return <div className="rounded-brand bg-brand-black px-4 py-2 text-sm text-brand-white shadow-card">{message}</div>;
}
