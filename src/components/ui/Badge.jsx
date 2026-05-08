const toneClasses = {
  slate: "bg-slate-100 text-slate-700",
  indigo: "bg-indigo-50 text-indigo-700",
  cyan: "bg-cyan-50 text-cyan-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
};

function Badge({ tone = "slate", className = "", children }) {
  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.slate} ${className}`}>
      <span className="truncate">{children}</span>
    </span>
  );
}

export default Badge;
