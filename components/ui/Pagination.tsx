export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-brand-muted">
      Page {page} of {totalPages}
    </div>
  );
}
