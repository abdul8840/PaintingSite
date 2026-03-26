import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div>
        <Link to="/">Go Home</Link>
        <Link to="/shop">Browse Shop</Link>
      </div>
    </div>
  );
}