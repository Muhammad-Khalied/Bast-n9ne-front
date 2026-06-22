export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sage text-sm font-semibold text-brand-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
