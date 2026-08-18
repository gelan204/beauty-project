export function EmptyState({ title, description, action }) {
  return (
    <div className="soft-card p-8 text-center">
      <h3 className="serif text-xl">{title}</h3>
      {description ? <p className="mt-3 text-sm text-[#746a61]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
