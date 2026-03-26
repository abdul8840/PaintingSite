import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedArtworks } from '../store/slices/artworkSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import { HiArrowRight, HiColorSwatch, HiPhotograph, HiTruck, HiShieldCheck } from 'react-icons/hi';

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured } = useSelector((state) => state.artworks);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedArtworks(8));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section>
        <div>
          <h1>Where Art Meets Passion</h1>
          <p>Discover original paintings from talented artists or commission your own custom artwork. From pencil sketches to oil paintings, bring your vision to life.</p>
          <div>
            <Link to="/shop">Explore Artworks <HiArrowRight /></Link>
            <Link to="/custom-painting">Custom Painting</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div>
          {[
            { icon: HiPhotograph, title: 'Original Artworks', desc: 'Handcrafted paintings from talented artists worldwide' },
            { icon: HiColorSwatch, title: 'Custom Paintings', desc: 'Upload your photo and get it transformed into art' },
            { icon: HiTruck, title: 'Free Shipping', desc: 'Free shipping on orders over $200' },
            { icon: HiShieldCheck, title: 'Secure Payments', desc: 'SSL encrypted payments via Stripe' },
          ].map((f, i) => (
            <div key={i}>
              <f.icon />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2>Browse Categories</h2>
        <div>
          {categories.map((cat) => (
            <Link key={cat._id} to={`/category/${cat.slug}`}>
              {cat.image?.url && <img src={cat.image.url} alt={cat.name} />}
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div>
          <h2>Featured Artworks</h2>
          <Link to="/shop?featured=true">View All <HiArrowRight /></Link>
        </div>
        <ArtworkGrid artworks={featured} />
      </section>

      {/* Custom CTA */}
      <section>
        <div>
          <h2>Get Your Custom Painting</h2>
          <p>Upload your favorite photo and our artists will transform it into a stunning painting. Choose from pencil sketch, watercolor, oil painting, and more.</p>
          <div>
            <div><span>1</span><p>Upload Photo</p></div>
            <div><span>2</span><p>Choose Style</p></div>
            <div><span>3</span><p>Get Your Art</p></div>
          </div>
          <Link to="/custom-painting">Start Now <HiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}