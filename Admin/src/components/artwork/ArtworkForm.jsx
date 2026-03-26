import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/slices/categorySlice';
import customOrderApi from '../../api/customOrderApi';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';
import { HiCloudUpload, HiX } from 'react-icons/hi';

const MEDIUMS = ['oil', 'acrylic', 'watercolor', 'pencil', 'charcoal', 'digital', 'mixed-media', 'ink', 'pastel', 'other'];
const STYLES = ['realistic', 'abstract', 'impressionist', 'modern', 'contemporary', 'pop-art', 'minimalist', 'surreal', 'portrait', 'landscape', 'other'];

export default function ArtworkForm({ initialData, onSubmit, loading }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const fileRef = useRef();
  const { items: categories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    title: '', description: '', price: '', comparePrice: '', category: '',
    artist: '', medium: '', style: '', stock: 1, tags: '',
    width: '', height: '', unit: 'inches',
    isFramed: false, frameDetails: '', isFeatured: false, isActive: true,
    seoTitle: '', seoDescription: '',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    // Fetch artists list
    customOrderApi.getArtists()
      .then(res => setArtists(res.artists || []))
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        comparePrice: initialData.comparePrice || '',
        category: initialData.category?._id || initialData.category || '',
        artist: initialData.artist?._id || initialData.artist || '',
        medium: initialData.medium || '',
        style: initialData.style || '',
        stock: initialData.stock ?? 1,
        tags: initialData.tags?.join(', ') || '',
        width: initialData.dimensions?.width || '',
        height: initialData.dimensions?.height || '',
        unit: initialData.dimensions?.unit || 'inches',
        isFramed: initialData.isFramed || false,
        frameDetails: initialData.frameDetails || '',
        isFeatured: initialData.isFeatured || false,
        isActive: initialData.isActive ?? true,
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
      });
      setImages(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (images.length + files.length > 5) { toast.error('Max 5 images allowed'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('folder', 'sketchmint/artworks');
      const res = await uploadApi.upload(formData);
      setImages([...images, ...res.images.map(img => ({ public_id: img.public_id, url: img.url, alt: form.title }))]);
      toast.success('Images uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('Please add at least one image'); return; }
    if (!form.category) { toast.error('Please select a category'); return; }
    if (!form.medium) { toast.error('Please select a medium'); return; }

    const data = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      images,
      dimensions: { width: Number(form.width), height: Number(form.height), unit: form.unit },
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    // Remove empty optional fields
    if (!data.artist) delete data.artist;
    if (!data.comparePrice) delete data.comparePrice;
    if (!data.seoTitle) delete data.seoTitle;
    if (!data.seoDescription) delete data.seoDescription;

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Basic Info */}
      <section>
        <h3>Basic Information</h3>
        <div>
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={200} />
        </div>
        <div>
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required maxLength={2000} rows={4} />
        </div>
        <div>
          <div>
            <label>Price ($) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" />
          </div>
          <div>
            <label>Compare Price ($)</label>
            <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0" step="0.01" />
          </div>
          <div>
            <label>Stock *</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" />
          </div>
        </div>
      </section>

      {/* Images */}
      <section>
        <h3>Images (max 5)</h3>
        <div>
          {images.map((img, i) => (
            <div key={i}>
              <img src={img.url} alt="" style={{ width: 100, height: 100, objectFit: 'cover' }} />
              <button type="button" onClick={() => removeImage(i)}><HiX /></button>
              {i === 0 && <span>Primary</span>}
            </div>
          ))}
          {images.length < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading...' : <><HiCloudUpload /> Add Image</>}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload} hidden />
        </div>
      </section>

      {/* Classification */}
      <section>
        <h3>Classification</h3>
        <div>
          <div>
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Artist</label>
            <select name="artist" value={form.artist} onChange={handleChange}>
              <option value="">Select Artist (Optional)</option>
              {artists.map((a) => (
                <option key={a._id} value={a._id}>{a.firstName} {a.lastName} ({a.email})</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div>
            <label>Medium *</label>
            <select name="medium" value={form.medium} onChange={handleChange} required>
              <option value="">Select Medium</option>
              {MEDIUMS.map((m) => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Style</label>
            <select name="style" value={form.style} onChange={handleChange}>
              <option value="">Select Style</option>
              {STYLES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section>
        <h3>Dimensions</h3>
        <div>
          <div>
            <label>Width *</label>
            <input name="width" type="number" value={form.width} onChange={handleChange} required min="1" step="0.1" />
          </div>
          <div>
            <label>Height *</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} required min="1" step="0.1" />
          </div>
          <div>
            <label>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="inches">Inches</option>
              <option value="cm">CM</option>
            </select>
          </div>
        </div>
      </section>

      {/* Options */}
      <section>
        <h3>Additional Options</h3>
        <div>
          <label>Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="landscape, nature, sunset" />
        </div>
        <div>
          <label>
            <input type="checkbox" name="isFramed" checked={form.isFramed} onChange={handleChange} />
            Framed
          </label>
          {form.isFramed && (
            <input name="frameDetails" value={form.frameDetails} onChange={handleChange} placeholder="Frame details (e.g., Black wood frame)" />
          )}
        </div>
        <div>
          <label>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Featured on homepage
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active (visible in store)
          </label>
        </div>
      </section>

      {/* SEO */}
      <section>
        <h3>SEO (Optional)</h3>
        <div>
          <label>SEO Title</label>
          <input name="seoTitle" value={form.seoTitle} onChange={handleChange} maxLength={70} />
        </div>
        <div>
          <label>SEO Description</label>
          <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} maxLength={160} />
        </div>
      </section>

      <div>
        <button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving...' : initialData ? 'Update Artwork' : 'Create Artwork'}
        </button>
      </div>
    </form>
  );
}