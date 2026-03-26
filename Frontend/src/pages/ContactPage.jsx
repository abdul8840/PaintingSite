import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useToast } from '../hooks/useToast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <p>Have a question? We'd love to hear from you.</p>

      <div>
        <div>
          <div><HiMail /><div><h3>Email</h3><p>support@sketchmint.com</p></div></div>
          <div><HiPhone /><div><h3>Phone</h3><p>+1 (555) 123-4567</p></div></div>
          <div><HiLocationMarker /><div><h3>Address</h3><p>New York, NY, USA</p></div></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <div><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          </div>
          <div><label>Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
          <div><label>Message</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required /></div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}