export default function Footer() {
  return (
    <footer className="bg-white border-t border-navy/10 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-extrabold text-navy tracking-tight text-sm uppercase">
            Covers
          </span>
          <span className="text-teal text-xs font-semibold lowercase tracking-wide">
            by washpool
          </span>
        </div>

        <p className="label-caps text-ink/30">
          &copy; {new Date().getFullYear()} Covers by Washpool
        </p>
      </div>
    </footer>
  );
}
