import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedArtworks } from '../store/slices/artworkSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import {
  HiArrowRight,
  HiColorSwatch,
  HiPhotograph,
  HiTruck,
  HiShieldCheck,
} from 'react-icons/hi';

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured } = useSelector((state) => state.artworks);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedArtworks(8));
    dispatch(fetchCategories());
  }, [dispatch]);

  const features = [
    {
      icon: HiPhotograph,
      title: 'Original Artworks',
      desc: 'Handcrafted paintings from talented artists worldwide',
    },
    {
      icon: HiColorSwatch,
      title: 'Custom Paintings',
      desc: 'Upload your photo and get it transformed into art',
    },
    {
      icon: HiTruck,
      title: 'Free Shipping',
      desc: 'Free shipping on orders over $200',
    },
    {
      icon: HiShieldCheck,
      title: 'Secure Payments',
      desc: 'SSL encrypted payments via Stripe',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large circle */}
          <div
            className="
              absolute -top-20 -right-20
              w-[500px] h-[500px] md:w-[700px] md:h-[700px]
              rounded-full
              bg-gradient-to-br from-cream to-mist/20
              opacity-60
            "
          />
          {/* Small accent circle */}
          <div
            className="
              absolute bottom-20 left-10
              w-32 h-32 md:w-48 md:h-48
              rounded-full
              bg-rust/5
              animate-float
            "
          />
          {/* Dot pattern */}
          <div
            className="
              absolute top-1/3 right-1/4
              w-2 h-2 rounded-full bg-gold/40
              animate-float
            "
            style={{ animationDelay: '1s' }}
          />
          <div
            className="
              absolute top-1/2 right-1/3
              w-3 h-3 rounded-full bg-rust/20
              animate-float
            "
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              className="
                animate-fade-in-up opacity-0
                inline-flex items-center gap-2
                px-4 py-1.5 rounded-full
                bg-rust/10 text-rust text-xs font-semibold uppercase tracking-widest
                mb-6
              "
              style={{ animationFillMode: 'forwards' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rust" />
              Original Art Gallery
            </div>

            {/* Heading */}
            <h1
              className="
                animate-fade-in-up opacity-0 stagger-2
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                font-black leading-[1.1] tracking-tight text-ink
              "
              style={{ animationFillMode: 'forwards' }}
            >
              Where Art
              <br />
              Meets{' '}
              <span className="text-gradient">Passion</span>
            </h1>

            {/* Subtitle */}
            <p
              className="
                animate-fade-in-up opacity-0 stagger-4
                mt-6 md:mt-8
                text-base md:text-lg leading-relaxed
                text-charcoal/70
                max-w-xl
              "
              style={{ animationFillMode: 'forwards' }}
            >
              Discover original paintings from talented artists or commission
              your own custom artwork. From pencil sketches to oil paintings,
              bring your vision to life.
            </p>

            {/* CTA Buttons */}
            <div
              className="
                animate-fade-in-up opacity-0 stagger-5
                mt-8 md:mt-10
                flex flex-col sm:flex-row gap-3 sm:gap-4
              "
              style={{ animationFillMode: 'forwards' }}
            >
              <Link
                to="/shop"
                className="
                  group inline-flex items-center justify-center gap-2
                  px-7 py-3.5 rounded-xl
                  bg-ink text-paper text-sm font-semibold
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                  shadow-lg shadow-ink/15
                "
              >
                Explore Artworks
                <HiArrowRight
                  className="
                    w-4 h-4
                    group-hover:translate-x-1
                    transition-transform duration-300
                  "
                />
              </Link>
              <Link
                to="/custom-painting"
                className="
                  inline-flex items-center justify-center gap-2
                  px-7 py-3.5 rounded-xl
                  border-2 border-ink text-ink text-sm font-semibold
                  hover:bg-ink hover:text-paper
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                "
              >
                Custom Painting
              </Link>
            </div>

            {/* Stats */}
            <div
              className="
                animate-fade-in-up opacity-0 stagger-7
                mt-12 md:mt-16
                flex items-center gap-8 md:gap-12
              "
              style={{ animationFillMode: 'forwards' }}
            >
              {[
                { value: '500+', label: 'Artworks' },
                { value: '200+', label: 'Artists' },
                { value: '1K+', label: 'Happy Clients' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl md:text-3xl font-black text-ink">
                    {stat.value}
                  </p>
                  <p className="text-xs text-mist uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-16 md:py-20 bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="
                  group
                  bg-paper rounded-2xl
                  p-6 md:p-8
                  border border-cream
                  hover-lift
                  transition-all duration-500
                  hover:border-rust/20
                "
              >
                <div
                  className="
                    w-12 h-12 rounded-xl
                    bg-rust/10
                    flex items-center justify-center
                    group-hover:bg-rust
                    transition-all duration-500
                    mb-5
                  "
                >
                  <f.icon
                    className="
                      w-6 h-6 text-rust
                      group-hover:text-paper
                      transition-colors duration-500
                    "
                  />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-mist leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-rust mb-3">
                Explore
              </p>
              <h2
                className="
                  text-3xl md:text-4xl lg:text-5xl font-black text-ink
                  tracking-tight
                "
              >
                Browse Categories
              </h2>
              <div className="mx-auto mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-rust to-gold" />
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {categories.map((cat, i) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="
                    group relative overflow-hidden
                    rounded-2xl bg-cream
                    hover-lift cursor-pointer
                    aspect-[4/3]
                  "
                >
                  {/* Image */}
                  {cat.image?.url && (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="
                        absolute inset-0 w-full h-full object-cover
                        group-hover:scale-110
                        transition-transform duration-700 ease-out
                      "
                    />
                  )}

                  {/* Overlay */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t from-ink/80 via-ink/20 to-transparent
                      group-hover:from-ink/90
                      transition-all duration-500
                    "
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                      className="
                        text-lg font-bold text-paper
                        group-hover:text-gold
                        transition-colors duration-300
                      "
                    >
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p
                        className="
                          text-xs text-paper/60 mt-1 line-clamp-2
                          group-hover:text-paper/80
                          transition-colors duration-300
                        "
                      >
                        {cat.description}
                      </p>
                    )}

                    {/* Arrow indicator */}
                    <div
                      className="
                        mt-3 inline-flex items-center gap-1
                        text-xs font-semibold text-gold
                        opacity-0 translate-y-2
                        group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300
                      "
                    >
                      Explore
                      <HiArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== FEATURED ARTWORKS ==================== */}
      <section className="py-16 md:py-24 bg-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div
            className="
              flex flex-col sm:flex-row items-start sm:items-end
              justify-between gap-4 mb-10 md:mb-14
            "
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rust mb-3">
                Curated Selection
              </p>
              <h2
                className="
                  text-3xl md:text-4xl lg:text-5xl font-black text-ink
                  tracking-tight
                "
              >
                Featured Artworks
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="
                group inline-flex items-center gap-2
                text-sm font-semibold text-rust
                hover:text-gold
                transition-colors duration-300 cursor-pointer
              "
            >
              View All
              <HiArrowRight
                className="
                  w-4 h-4
                  group-hover:translate-x-1
                  transition-transform duration-300
                "
              />
            </Link>
          </div>

          <ArtworkGrid artworks={featured} />
        </div>
      </section>

      {/* ==================== CUSTOM CTA ==================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="
              relative overflow-hidden
              bg-ink rounded-3xl
              px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20
            "
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="
                  absolute -top-24 -right-24
                  w-96 h-96 rounded-full
                  bg-rust/10
                "
              />
              <div
                className="
                  absolute -bottom-16 -left-16
                  w-64 h-64 rounded-full
                  bg-gold/5
                "
              />
            </div>

            <div className="relative text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-rust mb-4">
                Custom Art
              </p>
              <h2
                className="
                  text-3xl sm:text-4xl md:text-5xl font-black text-paper
                  tracking-tight leading-tight
                "
              >
                Get Your Custom
                <br />
                <span className="text-gradient">Painting</span>
              </h2>
              <p className="mt-5 text-sm md:text-base text-paper/50 leading-relaxed max-w-lg mx-auto">
                Upload your favorite photo and our artists will transform it
                into a stunning painting. Choose from pencil sketch, watercolor,
                oil painting, and more.
              </p>

              {/* Steps */}
              <div
                className="
                  mt-10 md:mt-12
                  flex flex-col sm:flex-row items-center justify-center
                  gap-6 sm:gap-10 md:gap-14
                "
              >
                {[
                  { num: '1', label: 'Upload Photo' },
                  { num: '2', label: 'Choose Style' },
                  { num: '3', label: 'Get Your Art' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="
                        w-10 h-10 rounded-xl
                        bg-rust flex items-center justify-center
                        text-paper font-black text-sm
                        shadow-lg shadow-rust/30
                      "
                    >
                      {step.num}
                    </span>
                    <p className="text-sm font-semibold text-paper/80">
                      {step.label}
                    </p>

                    {/* Connector line (not on last item) */}
                    {i < 2 && (
                      <div
                        className="
                          hidden sm:block w-8 md:w-12 h-px
                          bg-paper/20 ml-3
                        "
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/custom-painting"
                className="
                  group inline-flex items-center gap-2
                  mt-10 md:mt-12
                  px-8 py-4 rounded-xl
                  bg-rust text-paper text-sm font-bold
                  hover:bg-gold hover:text-ink
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                  shadow-lg shadow-rust/30
                "
              >
                Start Now
                <HiArrowRight
                  className="
                    w-4 h-4
                    group-hover:translate-x-1
                    transition-transform duration-300
                  "
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-16 md:py-20 bg-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight">
              Stay Inspired
            </h2>
            <p className="mt-3 text-sm text-mist">
              Subscribe to receive updates on new artworks, exclusive offers,
              and artist features.
            </p>

            <form
              className="
                mt-6 flex flex-col sm:flex-row gap-3
              "
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1 px-5 py-3 rounded-xl
                  bg-paper border border-cream
                  text-sm text-ink placeholder:text-mist
                  focus:outline-none focus:border-rust/40
                  focus:shadow-md focus:shadow-rust/5
                  transition-all duration-300
                "
              />
              <button
                type="submit"
                className="
                  px-6 py-3 rounded-xl
                  bg-ink text-paper text-sm font-semibold
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                  shadow-md shadow-ink/10
                "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}