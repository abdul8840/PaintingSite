import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer>
      <div>
        <div>
          {/* Brand */}
          <div>
            <Link to="/"><span>Sketch</span><span>Mint</span></Link>
            <p>Discover original paintings and commission custom artwork from talented artists worldwide.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <Link to="/shop">Shop</Link>
            <Link to="/custom-painting">Custom Painting</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Customer Service */}
          <div>
            <h4>Customer Service</h4>
            <Link to="/track-order">Track Order</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">My Account</Link>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact Us</h4>
            <p><HiMail /> support@sketchmint.com</p>
            <p><HiPhone /> +1 (555) 123-4567</p>
            <p><HiLocationMarker /> New York, NY</p>
          </div>
        </div>

        <div>
          <p>&copy; {new Date().getFullYear()} SketchMint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}