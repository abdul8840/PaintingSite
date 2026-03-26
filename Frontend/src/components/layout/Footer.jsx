import { Link } from 'react-router-dom';
import {
  HiMail, HiPhone, HiLocationMarker,
} from 'react-icons/hi';
import { HiSparkles, HiArrowRight } from 'react-icons/hi2';

const footerSections = [
  {
    title: 'Quick Links',
    links: [
      { to: '/shop',            label: 'Shop'            },
      { to: '/custom-painting', label: 'Custom Painting' },
      { to: '/about',           label: 'About Us'        },
      { to: '/contact',         label: 'Contact'         },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { to: '/track-order', label: 'Track Order' },
      { to: '/orders',      label: 'My Orders'   },
      { to: '/profile',     label: 'My Account'  },
      { to: '/wishlist',    label: 'Wishlist'     },
    ],
  },
];

const contactInfo = [
  { icon: HiMail,           text: 'support@sketchmint.com' },
  { icon: HiPhone,          text: '+1 (555) 123-4567'      },
  { icon: HiLocationMarker, text: 'New York, NY'           },
];

const socials = [
  { label: 'Fb', color: 'hover:bg-blue-500 hover:border-blue-500' },
  { label: 'Ig', color: 'hover:bg-pink-500 hover:border-pink-500' },
  { label: 'Tw', color: 'hover:bg-sky-400  hover:border-sky-400'  },
  { label: 'Pt', color: 'hover:bg-red-500  hover:border-red-500'  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-paper)] relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full
                      bg-[var(--color-rust)]/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full
                      bg-[var(--color-sage)]/6 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-64 h-64 rounded-full bg-[var(--color-gold)]/4 blur-3xl
                      pointer-events-none" />

      {/* ── Newsletter strip ── */}
      <div className="relative z-10 border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center
                          justify-between gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <HiSparkles className="w-4 h-4 text-[var(--color-gold)]" />
                <span className="text-xs font-bold text-[var(--color-gold)] uppercase
                                 tracking-widest">
                  Newsletter
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-paper)]">
                Stay in the loop
              </h3>
              <p className="text-sm text-[var(--color-paper)]/50 mt-1">
                New artworks, offers and artist spotlights — weekly.
              </p>
            </div>

            <form
              onSubmit={e => e.preventDefault()}
              className="flex gap-2 w-full sm:w-auto"
            >
              <div className="relative flex-1 sm:flex-none">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2
                                    w-4 h-4 text-[var(--color-mist)]" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full sm:w-60 pl-10 pr-4 py-2.5 bg-white/6 border
                             border-white/10 rounded-xl text-sm text-[var(--color-paper)]
                             placeholder-[var(--color-mist)] focus:outline-none
                             focus:border-[var(--color-gold)]/50
                             focus:ring-2 focus:ring-[var(--color-gold)]/15
                             focus:bg-white/10 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer flex items-center gap-1.5 px-4 py-2.5
                           bg-[var(--color-gold)] text-[var(--color-ink)] text-sm
                           font-bold rounded-xl hover:bg-[var(--color-gold)]/90
                           hover:-translate-y-0.5 hover:shadow-lg
                           hover:shadow-[var(--color-gold)]/25 active:scale-95
                           transition-all duration-200 whitespace-nowrap group
                           flex-shrink-0"
              >
                Subscribe
                <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-200
                                          group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
                      py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="cursor-pointer inline-flex items-center gap-1.5
                                     group mb-5 block">
              <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/12
                              flex items-center justify-center
                              group-hover:bg-white/15 group-hover:border-white/20
                              group-hover:-translate-y-0.5 transition-all duration-300">
                <HiSparkles className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
              <div>
                <span className="text-xl font-black text-[var(--color-paper)]
                                 group-hover:text-[var(--color-gold)] transition-colors
                                 duration-300">
                  Sketch
                </span>
                <span className="text-xl font-light text-[var(--color-rust)]
                                 group-hover:text-[var(--color-gold)] transition-colors
                                 duration-300">
                  Mint
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[var(--color-paper)]/50
                          max-w-xs mb-6">
              Discover original paintings and commission custom artwork from
              talented artists worldwide. Every piece tells a unique story.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mb-6">
              {socials.map(({ label, color }) => (
                <button
                  key={label}
                  className={`cursor-pointer w-9 h-9 rounded-xl bg-white/6 border
                               border-white/10 flex items-center justify-center
                               text-xs font-bold text-[var(--color-paper)]/50
                               hover:text-white hover:-translate-y-0.5
                               hover:shadow-lg transition-all duration-300 ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {['🔒 Secure Pay', '🎨 100% Original', '✈️ Fast Ship'].map(badge => (
                <span key={badge}
                  className="text-[10px] font-medium text-[var(--color-paper)]/40
                             bg-white/4 border border-white/8 px-2.5 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-widest
                             text-[var(--color-paper)] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-gradient-to-r from-[var(--color-rust)]
                                 to-[var(--color-gold)] rounded-full" />
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="cursor-pointer text-sm text-[var(--color-paper)]/50
                                 hover:text-[var(--color-gold)] hover:translate-x-1
                                 transition-all duration-200 inline-flex items-center
                                 gap-1.5 group w-fit"
                    >
                      <span className="w-0 h-px bg-[var(--color-gold)] transition-all
                                       duration-200 group-hover:w-3 rounded-full" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest
                           text-[var(--color-paper)] mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-[var(--color-rust)]
                               to-[var(--color-gold)] rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text}
                  className="flex items-start gap-3 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/10
                                  flex items-center justify-center flex-shrink-0
                                  group-hover:bg-[var(--color-rust)]/20
                                  group-hover:border-[var(--color-rust)]/30
                                  transition-all duration-300">
                    <Icon className="w-3.5 h-3.5 text-[var(--color-rust)]" />
                  </div>
                  <span className="text-sm text-[var(--color-paper)]/50
                                   group-hover:text-[var(--color-paper)]/70
                                   transition-colors duration-200 pt-1.5">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to="/contact"
              className="cursor-pointer inline-flex items-center gap-2 mt-6 px-4 py-2.5
                         rounded-xl bg-white/6 border border-white/12 text-sm font-medium
                         text-[var(--color-paper)]/70 hover:bg-[var(--color-rust)]/15
                         hover:border-[var(--color-rust)]/30 hover:text-[var(--color-paper)]
                         hover:-translate-y-0.5 transition-all duration-300 group"
            >
              Get in touch
              <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-200
                                        group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-paper)]/30 text-center sm:text-left">
            © {new Date().getFullYear()} SketchMint. All rights reserved.
            Crafted with ❤️ for art lovers everywhere.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="cursor-pointer text-xs text-[var(--color-paper)]/30
                           hover:text-[var(--color-paper)]/70 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}