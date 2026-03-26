export default function Loader({ size = 'default', text = '' }) {
  return (
    <div>
      <div></div>
      {text && <p>{text}</p>}
    </div>
  );
}