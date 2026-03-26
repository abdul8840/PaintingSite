export default function TopArtworks({ artworks = [] }) {
  if (!artworks.length) return null;

  return (
    <div>
      <h3>Top Selling Artworks</h3>
      <div>
        {artworks.map((art, i) => (
          <div key={art._id}>
            <span>{i + 1}</span>
            <img src={art.images?.[0]?.url || ''} alt={art.title} />
            <div>
              <p>{art.title}</p>
              <p>${art.price}</p>
            </div>
            <span>{art.sold} sold</span>
          </div>
        ))}
      </div>
    </div>
  );
}