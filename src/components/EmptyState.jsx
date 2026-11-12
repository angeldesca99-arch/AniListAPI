export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
