const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  luxury: 'btn-luxury',
};

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button type="button" className={`${base} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
