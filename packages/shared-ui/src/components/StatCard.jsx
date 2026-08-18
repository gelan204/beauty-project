export function StatCard({ label, value, hint }) {
  return (
    <div className="stat">
      <p className="text-sm text-[#746a61]">{label}</p>
      <p className="serif mt-2 text-3xl">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[#437a58]">{hint}</p> : null}
    </div>
  );
}
