import { Link } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/"><HiHome /> Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <HiChevronRight />
            {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}