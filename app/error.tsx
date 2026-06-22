"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-heading-lg font-heading">Something went wrong</h1>
      <button
        onClick={reset}
        className="rounded-brand bg-brand-sage px-5 py-2 text-brand-white"
      >
        Try again
      </button>
    </div>
  );
}
