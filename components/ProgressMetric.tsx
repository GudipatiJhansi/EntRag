export default function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid">
      <div className="topbar" style={{ margin: 0 }}>
        <strong>{label}</strong>
        <span>{value}%</span>
      </div>
      <div className="bar" aria-label={`${label} ${value}%`}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
