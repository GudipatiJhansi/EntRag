export default function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="card metric">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
      <span className="muted">{detail}</span>
    </div>
  );
}
