import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page">
      <h1>404</h1>
      <p>The page you requested was not found.</p>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default NotFound;
