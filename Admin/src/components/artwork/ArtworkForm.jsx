import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/slices/categorySlice';
import customOrderApi from '../../api/customOrderApi';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';
import { HiCloudUpload, HiX, HiPhotograph, HiStar } from 'react-icons/hi';

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
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
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

    if (!data.artist) delete data.artist;
    if (!data.comparePrice) delete data.comparePrice;
    if (!data.seoTitle) delete data.seoTitle;
    if (!data.seoDescription) delete data.seoDescription;

    onSubmit(data);
  };

  const formatLabel = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Basic Info Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-theme-primary text-white rounded-lg flex items-center justify-center text-sm">1</span>
          Basic Information
        </h3>
        
        <div className="space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="Enter artwork title"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
              "
            />
            <p className="mt-1 text-xs text-text-muted">{form.title.length}/200 characters</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={4}
              placeholder="Describe the artwork, its inspiration, techniques used..."
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                resize-none
              "
            />
            <p className="mt-1 text-xs text-text-muted">{form.description.length}/2000 characters</p>
          </div>

          {/* Price, Compare Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Price ($) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="
                    w-full pl-8 pr-4 py-2.5
                    text-sm text-text-primary
                    placeholder:text-text-muted
                    bg-bg-primary
                    border border-border-light rounded-lg
                    transition-all duration-200
                    hover:border-border-medium
                    focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  "
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Compare Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  name="comparePrice"
                  type="number"
                  value={form.comparePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="
                    w-full pl-8 pr-4 py-2.5
                    text-sm text-text-primary
                    placeholder:text-text-muted
                    bg-bg-primary
                    border border-border-light rounded-lg
                    transition-all duration-200
                    hover:border-border-medium
                    focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  "
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">Original price for sale display</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Stock <span className="text-error">*</span>
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                className="
                  w-full px-4 py-2.5
                  text-sm text-text-primary
                  placeholder:text-text-muted
                  bg-bg-primary
                  border border-border-light rounded-lg
                  transition-all duration-200
                  hover:border-border-medium
                  focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Images Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-theme-primary text-white rounded-lg flex items-center justify-center text-sm">2</span>
          Images
          <span className="ml-auto text-sm font-normal text-text-muted">{images.length}/5</span>
        </h3>

        {/* Image Preview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
          {images.map((img, i) => (
            <div 
              key={i}
              className="
                relative group
                aspect-square
                bg-bg-secondary
                rounded-xl
                overflow-hidden
                border-2 border-border-light
                hover:border-theme-secondary
                transition-all duration-200
              "
            >
              <img 
                src={img.url} 
                alt={img.alt || 'Artwork'} 
                className="w-full h-full object-cover"
              />
              
              {/* Primary Badge */}
              {i === 0 && (
                <span className="
                  absolute top-2 left-2
                  px-2 py-0.5
                  bg-theme-primary text-white
                  text-xs font-medium
                  rounded-full
                  flex items-center gap-1
                ">
                  <HiStar className="w-3 h-3" />
                  Primary
                </span>
              )}
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="
                  absolute top-2 right-2
                  p-1.5
                  bg-error text-white
                  rounded-full
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  cursor-pointer
                  hover:bg-red-600
                "
              >
                <HiX className="w-4 h-4" />
              </button>
              
              {/* Overlay */}
              <div className="
                absolute inset-0
                bg-black/0 group-hover:bg-black/20
                transition-colors duration-200
              " />
            </div>
          ))}

          {/* Upload Button */}
          {images.length < 5 && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                aspect-square
                border-2 border-dashed rounded-xl
                flex flex-col items-center justify-center
                transition-all duration-200
                cursor-pointer
                ${dragActive 
                  ? 'border-theme-primary bg-theme-primary/5' 
                  : 'border-border-medium hover:border-theme-secondary hover:bg-bg-secondary'
                }
              `}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="
                  w-full h-full
                  flex flex-col items-center justify-center
                  cursor-pointer
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-theme-primary border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs text-text-muted">Uploading...</span>
                  </>
                ) : (
                  <>
                    <HiCloudUpload className="w-8 h-8 text-text-muted mb-2" />
                    <span className="text-xs text-text-muted text-center px-2">
                      Click or drag
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted">
          Upload up to 5 images. First image will be the primary/featured image. Supported: JPG, PNG, WEBP (max 10MB each)
        </p>

        <input 
          ref={fileRef} 
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          multiple 
          onChange={handleImageUpload} 
          hidden 
        />
      </section>

      {/* Classification Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-theme-primary text-white rounded-lg flex items-center justify-center text-sm">3</span>
          Classification
        </h3>

        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Category <span className="text-error">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-2.5
                  text-sm text-text-primary
                  bg-bg-primary
                  border border-border-light rounded-lg
                  transition-all duration-200
                  hover:border-border-medium
                  focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
                  bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
                "
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Artist */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Artist
              </label>
              <select
                name="artist"
                value={form.artist}
                onChange={handleChange}
                className="
                  w-full px-4 py-2.5
                  text-sm text-text-primary
                  bg-bg-primary
                  border border-border-light rounded-lg
                  transition-all duration-200
                  hover:border-border-medium
                  focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
                  bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
                "
              >
                <option value="">Select Artist (Optional)</option>
                {artists.map((a) => (
                  <option key={a._id} value={a._id}>{a.firstName} {a.lastName} ({a.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Medium <span className="text-error">*</span>
              </label>
              <select
                name="medium"
                value={form.medium}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-2.5
                  text-sm text-text-primary
                  bg-bg-primary
                  border border-border-light rounded-lg
                  transition-all duration-200
                  hover:border-border-medium
                  focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
                  bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
                "
              >
                <option value="">Select Medium</option>
                {MEDIUMS.map((m) => (
                  <option key={m} value={m}>{formatLabel(m)}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Style
              </label>
              <select
                name="style"
                value={form.style}
                onChange={handleChange}
                className="
                  w-full px-4 py-2.5
                  text-sm text-text-primary
                  bg-bg-primary
                  border border-border-light rounded-lg
                  transition-all duration-200
                  hover:border-border-medium
                  focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
                  bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
                "
              >
                <option value="">Select Style</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{formatLabel(s)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-theme-primary text-white rounded-lg flex items-center justify-center text-sm">4</span>
          Dimensions
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Width <span className="text-error">*</span>
            </label>
            <input
              name="width"
              type="number"
              value={form.width}
              onChange={handleChange}
              required
              min="1"
              step="0.1"
              placeholder="0"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Height <span className="text-error">*</span>
            </label>
            <input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              required
              min="1"
              step="0.1"
              placeholder="0"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Unit
            </label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                cursor-pointer
                appearance-none
                bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
                bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
              "
            >
              <option value="inches">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
        </div>

        {form.width && form.height && (
          <p className="mt-3 text-sm text-text-secondary">
            Artwork size: <span className="font-medium">{form.width} × {form.height} {form.unit}</span>
          </p>
        )}
      </section>

      {/* Additional Options Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-theme-primary text-white rounded-lg flex items-center justify-center text-sm">5</span>
          Additional Options
        </h3>

        <div className="space-y-4 sm:space-y-5">
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tags
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="landscape, nature, sunset, mountain"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
              "
            />
            <p className="mt-1 text-xs text-text-muted">Separate tags with commas</p>
          </div>

          {/* Frame Options */}
          <div className="p-4 bg-bg-secondary rounded-lg border border-border-light">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFramed"
                checked={form.isFramed}
                onChange={handleChange}
                className="
                  w-5 h-5
                  rounded
                  border-border-medium
                  text-theme-primary
                  focus:ring-theme-secondary focus:ring-offset-0
                  cursor-pointer
                "
              />
              <span className="text-sm font-medium text-text-primary">This artwork is framed</span>
            </label>
            
            {form.isFramed && (
              <div className="mt-3 ml-8">
                <input
                  name="frameDetails"
                  value={form.frameDetails}
                  onChange={handleChange}
                  placeholder="e.g., Black wood frame, 2-inch border"
                  className="
                    w-full px-4 py-2.5
                    text-sm text-text-primary
                    placeholder:text-text-muted
                    bg-bg-primary
                    border border-border-light rounded-lg
                    transition-all duration-200
                    hover:border-border-medium
                    focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                  "
                />
              </div>
            )}
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="
              flex items-center gap-3 
              p-4 
              bg-bg-secondary rounded-lg border border-border-light
              cursor-pointer
              hover:border-theme-secondary
              transition-colors duration-200
            ">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="
                  w-5 h-5
                  rounded
                  border-border-medium
                  text-theme-primary
                  focus:ring-theme-secondary focus:ring-offset-0
                  cursor-pointer
                "
              />
              <div>
                <span className="block text-sm font-medium text-text-primary">Featured</span>
                <span className="block text-xs text-text-muted">Show on homepage</span>
              </div>
            </label>

            <label className="
              flex items-center gap-3 
              p-4 
              bg-bg-secondary rounded-lg border border-border-light
              cursor-pointer
              hover:border-theme-secondary
              transition-colors duration-200
            ">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="
                  w-5 h-5
                  rounded
                  border-border-medium
                  text-theme-primary
                  focus:ring-theme-secondary focus:ring-offset-0
                  cursor-pointer
                "
              />
              <div>
                <span className="block text-sm font-medium text-text-primary">Active</span>
                <span className="block text-xs text-text-muted">Visible in store</span>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="bg-bg-primary rounded-xl border border-border-light p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
          <span className="w-8 h-8 bg-bg-tertiary text-text-secondary rounded-lg flex items-center justify-center text-sm">6</span>
          SEO
          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-text-muted bg-bg-tertiary rounded-full">Optional</span>
        </h3>
        <p className="text-sm text-text-muted mb-4 sm:mb-6">Optimize for search engines</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              SEO Title
            </label>
            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              maxLength={70}
              placeholder="Custom title for search engines"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
              "
            />
            <p className="mt-1 text-xs text-text-muted">{form.seoTitle.length}/70 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={2}
              maxLength={160}
              placeholder="Brief description for search results"
              className="
                w-full px-4 py-2.5
                text-sm text-text-primary
                placeholder:text-text-muted
                bg-bg-primary
                border border-border-light rounded-lg
                transition-all duration-200
                hover:border-border-medium
                focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
                resize-none
              "
            />
            <p className="mt-1 text-xs text-text-muted">{form.seoDescription.length}/160 characters</p>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="
        sticky bottom-0
        bg-bg-secondary
        border-t border-border-light
        -mx-4 sm:-mx-6 lg:-mx-8
        px-4 sm:px-6 lg:px-8
        py-4
        flex flex-col sm:flex-row items-center justify-end gap-3
      ">
        <button
          type="submit"
          disabled={loading || uploading}
          className="
            w-full sm:w-auto
            px-6 sm:px-8 py-3
            bg-theme-primary hover:bg-theme-accent
            text-white font-medium
            rounded-lg
            transition-all duration-200
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <HiPhotograph className="w-5 h-5" />
              {initialData ? 'Update Artwork' : 'Create Artwork'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}