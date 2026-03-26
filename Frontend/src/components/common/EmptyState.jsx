import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div>
      {Icon && <Icon />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && actionHref && <Link to={actionHref}>{actionLabel}</Link>}
    </div>
  );
}