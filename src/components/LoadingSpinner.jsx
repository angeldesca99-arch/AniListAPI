export default function LoadingSpinner() {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="spinner" />
      <p>Loading anime data...</p>
    </div>
  );
}
