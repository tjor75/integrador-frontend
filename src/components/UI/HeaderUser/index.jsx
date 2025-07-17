export default function HeaderUser({ user }) {
    return (
        <>
            <p>{user.name} {user.email}</p>
            <button className="btn btn-primary">
                <i className="icon icon-shutdown"></i>
            </button>
        </>
    );
}