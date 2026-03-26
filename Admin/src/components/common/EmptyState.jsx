export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div>
      {Icon && <Icon />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}