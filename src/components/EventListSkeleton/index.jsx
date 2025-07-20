import EventCardSkeleton from "../UI/EventCardSkeleton";

export default function EventListSkeleton() {
    return (
        <div className="event-list">
            <div className="columns">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div className="column col-4 col-md-6 col-sm-12" key={"event-loading-" + index}>
                        <EventCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}