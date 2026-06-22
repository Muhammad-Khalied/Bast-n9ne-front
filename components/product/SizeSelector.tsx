export function SizeSelector({ sizes }: { sizes: string[] }) {
  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <span key={size} className="rounded-brand border border-brand-ivory-dark px-2 py-1 text-xs">
          {size}
        </span>
      ))}
    </div>
  );
}
