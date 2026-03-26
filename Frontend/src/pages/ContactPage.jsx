import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiChat, HiClock } from 'react-icons/hi';
import { useToast } from '../hooks/useToast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    { 
      icon: HiMail, 
      title: 'Email', 
      value: 'support@sketchmint.com',
      link: 'mailto:support@sketchmint.com',
      color: 'sage'
    },
    { 
      icon: HiPhone, 
      title: 'Phone', 
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'gold'
    },
    { 
      icon: HiLocationMarker, 
      title: 'Address', 
      value: 'New York, NY, USA',
      link: null,
      color: 'rust'
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full mb-6">
            <HiChat className="w-5 h-5 text-sage" />
            <span className="text-sm font-medium text-sage">We're here to help</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-charcoal/70 max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 animate-fade-in-up">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className={`group flex items-start gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-cream hover:shadow-xl hover:border-${item.color}/30 transition-all duration-300 animate-fade-in-up ${item.link ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    item.color === 'sage' ? 'bg-sage/10' :
                    item.color === 'gold' ? 'bg-gold/10' :
                    'bg-rust/10'
                  }`}>
                    <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
                      item.color === 'sage' ? 'text-sage' :
                      item.color === 'gold' ? 'text-gold' :
                      'text-rust'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink text-base sm:text-lg mb-1">{item.title}</h3>
                    <p className="text-charcoal/70 text-sm sm:text-base">{item.value}</p>
                  </div>
                </a>
              ))}

              {/* Business Hours */}
              <div className="p-5 sm:p-6 bg-cream/50 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-charcoal/10 rounded-lg flex items-center justify-center">
                    <HiClock className="w-5 h-5 text-charcoal" />
                  </div>
                  <h3 className="font-semibold text-ink">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Mon - Fri</span>
                    <span className="font-medium text-ink">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Saturday</span>
                    <span className="font-medium text-ink">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Sunday</span>
                    <span className="font-medium text-ink">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 animate-fade-in-up stagger-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream p-6 sm:p-8 lg:p-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 sm:mb-8">Send us a Message</h2>
                
                <div className="space-y-5 sm:space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up stagger-1">
                      <label className="block text-sm font-medium text-ink mb-2">
                        Your Name <span className="text-rust">*</span>
                      </label>
                      <input 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        required 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                    <div className="animate-fade-in-up stagger-2">
                      <label className="block text-sm font-medium text-ink mb-2">
                        Email Address <span className="text-rust">*</span>
                      </label>
                      <input 
                        type="email" 
                        value={form.email} 
                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                        required 
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="animate-fade-in-up stagger-3">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Subject <span className="text-rust">*</span>
                    </label>
                    <input 
                      value={form.subject} 
                      onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                      required 
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>

                  {/* Message */}
                  <div className="animate-fade-in-up stagger-4">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Message <span className="text-rust">*</span>
                    </label>
                    <textarea 
                      value={form.message} 
                      onChange={(e) => setForm({ ...form, message: e.target.value })} 
                      rows={5} 
                      required 
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 animate-fade-in-up stagger-5">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <HiPaperAirplane className="w-5 h-5 rotate-90" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}