import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const quickLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/custom-painting', label: 'Custom Painting' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const serviceLinks = [
    { to: '/track-order', label: 'Track Order' },
    { to: '/orders', label: 'My Orders' },
    { to: '/profile', label: 'My Account' },
  ];

  const contactInfo = [
    { icon: HiMail, text: 'support@sketchmint.com' },
    { icon: HiPhone, text: '+1 (555) 123-4567' },
    { icon: HiLocationMarker, text: 'New York, NY' },
  ];

  return (
    <footer className="bg-ink text-paper/80">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-0.5 cursor-pointer group"
            >
              <span
                className="
                  text-2xl font-black text-paper
                  group-hover:text-gold transition-colors duration-300
                "
              >
                Sketch
              </span>
              <span
                className="
                  text-2xl font-light text-rust
                  group-hover:text-gold transition-colors duration-300
                "
              >
                Mint
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-paper/50 max-w-xs">
              Discover original paintings and commission custom artwork from
              talented artists worldwide.
            </p>

            {/* Social placeholder */}
            <div className="flex items-center gap-3 mt-6">
              {['Fb', 'Ig', 'Tw', 'Pt'].map((s) => (
                <div
                  key={s}
                  className="
                    w-9 h-9 rounded-lg bg-paper/5
                    flex items-center justify-center
                    text-xs font-bold text-paper/40
                    hover:bg-rust hover:text-paper
                    transition-all duration-300 cursor-pointer
                  "
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="
                text-sm font-bold uppercase tracking-widest text-paper
                mb-5
              "
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="
                    text-sm text-paper/50 hover:text-gold
                    transition-colors duration-300 cursor-pointer
                    w-fit
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4
              className="
                text-sm font-bold uppercase tracking-widest text-paper
                mb-5
              "
            >
              Customer Service
            </h4>
            <div className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="
                    text-sm text-paper/50 hover:text-gold
                    transition-colors duration-300 cursor-pointer
                    w-fit
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="
                text-sm font-bold uppercase tracking-widest text-paper
                mb-5
              "
            >
              Contact Us
            </h4>
            <div className="flex flex-col gap-4">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm text-paper/50"
                >
                  <item.icon className="w-4 h-4 mt-0.5 text-rust shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-paper/30 text-center">
            &copy; {new Date().getFullYear()} SketchMint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}