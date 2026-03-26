import { HiColorSwatch, HiUserGroup, HiGlobe, HiShieldCheck, HiSparkles, HiHeart } from 'react-icons/hi';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full mb-6 sm:mb-8">
            <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sage" />
            <span className="text-sm sm:text-base font-medium text-sage">Celebrating Art & Artists</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 sm:mb-8 leading-tight">
            About <span className="text-gradient">SketchMint</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
            We connect talented artists with art lovers worldwide. Whether you're looking for an original painting or want a custom piece created just for you, SketchMint makes it possible.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: HiColorSwatch, title: '500+', desc: 'Original Artworks', color: 'sage' },
              { icon: HiUserGroup, title: '50+', desc: 'Talented Artists', color: 'gold' },
              { icon: HiGlobe, title: '30+', desc: 'Countries Served', color: 'rust' },
              { icon: HiShieldCheck, title: '2000+', desc: 'Happy Customers', color: 'charcoal' },
            ].map((s, i) => (
              <div 
                key={i}
                className="group relative bg-paper rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  s.color === 'sage' ? 'bg-sage/10' :
                  s.color === 'gold' ? 'bg-gold/10' :
                  s.color === 'rust' ? 'bg-rust/10' :
                  'bg-charcoal/10'
                }`}>
                  <s.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${
                    s.color === 'sage' ? 'text-sage' :
                    s.color === 'gold' ? 'text-gold' :
                    s.color === 'rust' ? 'text-rust' :
                    'text-charcoal'
                  }`} />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-1 sm:mb-2">{s.title}</h3>
                <p className="text-sm sm:text-base text-charcoal/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg animate-fade-in-up">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-sage/20 to-transparent rounded-bl-[100px] rounded-tr-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                  <HiHeart className="w-5 h-5 sm:w-6 sm:h-6 text-sage" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">Our Mission</h2>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-charcoal/70 leading-relaxed">
                To make original art accessible to everyone and provide artists a platform to showcase and sell their work globally. We believe every space deserves unique art that tells a story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-cream/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-charcoal/60 max-w-2xl mx-auto">
              Getting your perfect artwork is simple and seamless
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: '1', title: 'Browse or Upload', desc: 'Explore our gallery or upload your photo for a custom painting.' },
              { num: '2', title: 'Choose & Customize', desc: 'Select your preferred style, size, and framing options.' },
              { num: '3', title: 'Secure Payment', desc: 'Pay securely with Stripe. Your payment is protected.' },
              { num: '4', title: 'Receive Your Art', desc: 'Get your artwork delivered to your doorstep with care.' },
            ].map((step, i) => (
              <div 
                key={i}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Connector line (hidden on mobile, visible on larger screens) */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sage/30 to-sage/10" />
                )}
                
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-ink to-charcoal rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl sm:text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-ink mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-charcoal/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-6">
            Ready to Find Your Perfect Artwork?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-[0.98] text-center"
            >
              Browse Gallery
            </a>
            <a 
              href="/custom-order"
              className="w-full sm:w-auto px-8 py-4 bg-white text-ink border-2 border-ink rounded-xl font-semibold hover:bg-ink hover:text-white transition-all duration-300 cursor-pointer active:scale-[0.98] text-center"
            >
              Create Custom Art
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}