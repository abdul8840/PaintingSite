import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Artwork from '../models/Artwork.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Artwork.deleteMany({}),
      Coupon.deleteMany({}),
    ]);

    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'SketchMint',
      email: 'admin@sketchmint.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    // Create artists
    const artist1 = await User.create({
      firstName: 'Sarah',
      lastName: 'Anderson',
      email: 'sarah@sketchmint.com',
      password: 'artist123',
      role: 'artist',
      isVerified: true,
      artistBio: 'Professional portrait artist with 10 years of experience in oil and watercolor.',
      artistSpecialties: ['portrait', 'watercolor', 'oil-painting'],
    });

    const artist2 = await User.create({
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael@sketchmint.com',
      password: 'artist123',
      role: 'artist',
      isVerified: true,
      artistBio: 'Digital artist and illustrator specializing in modern and abstract art.',
      artistSpecialties: ['digital', 'abstract', 'pop-art'],
    });

    // Create customer
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'customer123',
      role: 'customer',
      addresses: [{
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isDefault: true,
      }],
    });

    console.log('Users created');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Portraits', description: 'Beautiful portrait paintings of people and pets', sortOrder: 1 },
      { name: 'Landscapes', description: 'Scenic landscape and nature paintings', sortOrder: 2 },
      { name: 'Abstract', description: 'Modern abstract art and compositions', sortOrder: 3 },
      { name: 'Still Life', description: 'Classic still life paintings', sortOrder: 4 },
      { name: 'Digital Art', description: 'Modern digital illustrations and art', sortOrder: 5 },
      { name: 'Pop Art', description: 'Bold and colorful pop art pieces', sortOrder: 6 },
      { name: 'Watercolor', description: 'Delicate watercolor paintings', sortOrder: 7 },
      { name: 'Charcoal & Pencil', description: 'Classic charcoal and pencil sketches', sortOrder: 8 },
    ]);

    console.log('Categories created');

    // Create artworks
    const artworks = [];
    const mediums = ['oil', 'acrylic', 'watercolor', 'pencil', 'charcoal', 'digital'];
    const styles = ['realistic', 'abstract', 'impressionist', 'modern', 'contemporary', 'portrait', 'landscape'];

    const artworkData = [
      { title: 'Sunset Over Mountains', desc: 'A breathtaking view of sunset over mountain ranges painted in vibrant oil colors.', price: 4500, cat: 1, artist: 0, medium: 'oil', style: 'landscape' },
      { title: 'Urban Portrait Study', desc: 'A modern portrait capturing the essence of urban life through bold strokes.', price: 3200, cat: 0, artist: 0, medium: 'acrylic', style: 'portrait' },
      { title: 'Abstract Harmony', desc: 'An abstract composition exploring the harmony between colors and forms.', price: 5800, cat: 2, artist: 1, medium: 'acrylic', style: 'abstract' },
      { title: 'Garden Roses', desc: 'Delicate watercolor painting of blooming roses in a garden setting.', price: 2800, cat: 3, artist: 0, medium: 'watercolor', style: 'realistic' },
      { title: 'Digital Dreams', desc: 'A stunning digital illustration exploring surreal dreamscapes.', price: 2500, cat: 4, artist: 1, medium: 'digital', style: 'modern' },
      { title: 'Classic Pencil Portrait', desc: 'A detailed pencil sketch portrait showing incredible detail and shading.', price: 1800, cat: 7, artist: 0, medium: 'pencil', style: 'realistic' },
      { title: 'Neon City Nights', desc: 'Pop art inspired cityscape with bold neon colors and geometric shapes.', price: 4200, cat: 5, artist: 1, medium: 'digital', style: 'contemporary' },
      { title: 'Ocean Serenity', desc: 'A calming seascape painted in soft watercolors capturing the morning light.', price: 3500, cat: 1, artist: 0, medium: 'watercolor', style: 'impressionist' },
      { title: 'Charcoal Expression', desc: 'An expressive charcoal drawing exploring human emotions.', price: 2200, cat: 7, artist: 0, medium: 'charcoal', style: 'modern' },
      { title: 'Geometric Fusion', desc: 'A modern abstract piece combining geometric shapes with organic forms.', price: 4900, cat: 2, artist: 1, medium: 'acrylic', style: 'abstract' },
      { title: 'Vintage Still Life', desc: 'A classic still life painting of vintage objects with rich warm tones.', price: 3100, cat: 3, artist: 0, medium: 'oil', style: 'realistic' },
      { title: 'Tropical Paradise', desc: 'A vibrant landscape of a tropical paradise with palm trees and turquoise waters.', price: 3800, cat: 1, artist: 0, medium: 'acrylic', style: 'landscape' },
    ]

    const artists = [artist1, artist2];

    for (const data of artworkData) {
      artworks.push({
        title: data.title,
        description: data.desc,
        price: data.price,
        comparePrice: data.price + Math.floor(Math.random() * 100) + 50,
        images: [{ public_id: `sketchmint/sample_${Date.now()}`, url: 'https://placehold.co/600x800/2d3748/ffffff?text=' + encodeURIComponent(data.title), alt: data.title }],
        category: categories[data.cat]._id,
        artist: artists[data.artist]._id,
        medium: data.medium,
        style: data.style,
        dimensions: { width: 16 + Math.floor(Math.random() * 20), height: 20 + Math.floor(Math.random() * 20), unit: 'inches' },
        stock: Math.floor(Math.random() * 5) + 1,
        tags: [data.medium, data.style, 'original', 'handmade'],
        isFeatured: Math.random() > 0.5,
        ratings: { average: (3.5 + Math.random() * 1.5).toFixed(1), count: Math.floor(Math.random() * 20) },
      });
    }

    await Artwork.insertMany(artworks);
    console.log('Artworks created');

    // Create coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: '10% off for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 500,
        maximumDiscount: 500,
        usageLimit: 1000,
        perUserLimit: 1,
        applicableTo: 'all',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'CUSTOM20',
        description: '20% off custom painting orders',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderAmount: 1000,
        maximumDiscount: 1000,
        usageLimit: 500,
        perUserLimit: 2,
        applicableTo: 'custom-order',
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FLAT25',
        description: '$25 off on orders above $200',
        discountType: 'fixed',
        discountValue: 250,
        minimumOrderAmount: 2000,
        usageLimit: 200,
        perUserLimit: 1,
        applicableTo: 'all',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('Coupons created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@sketchmint.com / admin123');
    console.log('Artist: sarah@sketchmint.com / artist123');
    console.log('Artist: michael@sketchmint.com / artist123');
    console.log('Customer: john@example.com / customer123');
    console.log('\nCoupon Codes: WELCOME10, CUSTOM20, FLAT25');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();