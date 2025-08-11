import { Link } from "react-router-dom";

export default function EventTagsCard({ tags }) {
    return (
        <div className="card mb-2">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-bookmark mr-2"></i>
                    Etiquetas
                </div>
            </div>
            <div className="card-body">
                <div className="d-flex flex-wrap">
                    {tags.map((tag, index) => (
                        <Link 
                            key={"tag" + index} 
                            className="btn btn-link chip bg-primary text-light mr-2 mb-1" 
                            to={"/events?tag=" + tag.name}
                        >
                            <i className="icon icon-bookmark mr-1"></i>
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}