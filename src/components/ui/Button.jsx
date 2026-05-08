const variantClasses = {
  primary: "border-transparent bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700",
  secondary: "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700",
  dark: "border-transparent bg-slate-950 text-white hover:bg-slate-800",
  ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  danger: "border-transparent bg-rose-600 text-white hover:bg-rose-700",
};

const sizeClasses = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  type,
  ...props
}) {
  return (
    <Component
      type={Component === "button" ? type || "button" : undefined}
      disabled={disabled}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
        "max-w-full whitespace-normal text-center",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
