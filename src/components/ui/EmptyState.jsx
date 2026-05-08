function EmptyState({ title = "Nothing to show yet", description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
