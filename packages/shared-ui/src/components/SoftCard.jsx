export function SoftCard({ className = '', children, ...props }) {
  return (
    <div className={`soft-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
