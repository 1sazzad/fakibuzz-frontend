function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
