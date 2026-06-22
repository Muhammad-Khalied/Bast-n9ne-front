export function ColorSelector({ colors }: { colors: { name: string; hex: string }[] }) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <span
          key={color.name}
          className="h-6 w-6 rounded-full border border-brand-ivory-dark"
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
    </div>
  );
}
