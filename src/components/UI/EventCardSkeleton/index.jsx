export default function EventCardSkeleton() {
  return (
    <div className="card event-card">
        <div className="card-header">
            <p className="card-title h3 skeleton skeleton-text"></p>
        </div>
        <div className="card-body">
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
        </div>
    </div>
  );
}