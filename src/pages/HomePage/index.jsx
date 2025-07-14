export default function HomePage() {
    return (
        <div class="empty">
            <div class="empty-icon">
                <i class="icon icon-people"></i>
            </div>
            <p class="empty-title h5">You have no new messages</p>
            <p class="empty-subtitle">Click the button to start a conversation.</p>
            <div class="empty-action">
                <button class="btn btn-primary">Send a message</button>
            </div>
        </div>
    )
}