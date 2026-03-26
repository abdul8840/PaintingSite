import { HiColorSwatch, HiUserGroup, HiGlobe, HiShieldCheck } from 'react-icons/hi';

export default function AboutPage() {
  return (
    <div>
      <section>
        <h1>About SketchMint</h1>
        <p>We connect talented artists with art lovers worldwide. Whether you're looking for an original painting or want a custom piece created just for you, SketchMint makes it possible.</p>
      </section>

      <section>
        <div>
          {[
            { icon: HiColorSwatch, title: '500+', desc: 'Original Artworks' },
            { icon: HiUserGroup, title: '50+', desc: 'Talented Artists' },
            { icon: HiGlobe, title: '30+', desc: 'Countries Served' },
            { icon: HiShieldCheck, title: '2000+', desc: 'Happy Customers' },
          ].map((s, i) => (
            <div key={i}>
              <s.icon />
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Our Mission</h2>
        <p>To make original art accessible to everyone and provide artists a platform to showcase and sell their work globally. We believe every space deserves unique art that tells a story.</p>
      </section>

      <section>
        <h2>How It Works</h2>
        <div>
          <div><span>1</span><h3>Browse or Upload</h3><p>Explore our gallery or upload your photo for a custom painting.</p></div>
          <div><span>2</span><h3>Choose & Customize</h3><p>Select your preferred style, size, and framing options.</p></div>
          <div><span>3</span><h3>Secure Payment</h3><p>Pay securely with Stripe. Your payment is protected.</p></div>
          <div><span>4</span><h3>Receive Your Art</h3><p>Get your artwork delivered to your doorstep with care.</p></div>
        </div>
      </section>
    </div>
  );
}