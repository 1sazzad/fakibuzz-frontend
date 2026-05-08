function ResponsiveContainer({ as: Component = "main", className = "", children }) {
  return (
    <Component className={`min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </Component>
  );
}

export default ResponsiveContainer;
