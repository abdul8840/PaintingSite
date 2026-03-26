import ArtworkCard from './ArtworkCard';

export default function ArtworkGrid({ artworks, loading }) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div></div>
            <div><div></div><div></div><div></div></div>
          </div>
        ))}
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return <div><p>No artworks found</p></div>;
  }

  return (
    <div>
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork._id} artwork={artwork} />
      ))}
    </div>
  );
}