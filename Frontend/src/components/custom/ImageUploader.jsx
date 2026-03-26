import { useState, useRef } from 'react';
import { HiCloudUpload, HiX, HiPhotograph, HiCheckCircle } from 'react-icons/hi';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';

export default function ImageUploader({ value, onChange, label = 'Upload Reference Image' }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef();
  const toast = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'sketchmint/custom-orders');
      const res = await uploadApi.uploadSingle(formData);
      onChange(res.images[0]);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleRemove = () => onChange(null);

  return (
    <div className="animate-fade-in-up">
      <label className="block text-sm sm:text-base font-medium text-ink mb-3">
        {label}
      </label>
      
      {value?.url ? (
        /* Image Preview */
        <div className="relative group rounded-xl overflow-hidden bg-cream animate-scale-in">
          <img 
            src={value.url} 
            alt="Reference" 
            className="w-full h-48 sm:h-64 lg:h-72 object-contain bg-white"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all duration-300 flex items-center justify-center">
            <button 
              onClick={handleRemove}
              className="p-3 sm:p-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-rust hover:text-white transform scale-75 group-hover:scale-100"
              aria-label="Remove image"
            >
              <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Success badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-sage text-white text-xs font-medium rounded-full shadow-lg">
            <HiCheckCircle className="w-3.5 h-3.5" />
            <span>Uploaded</span>
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div 
          onClick={() => !uploading && fileRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 cursor-pointer ${
            dragActive 
              ? 'border-sage bg-sage/5 scale-[1.02]' 
              : uploading 
              ? 'border-mist bg-cream/50 cursor-wait' 
              : 'border-cream bg-paper hover:border-sage/50 hover:bg-sage/5'
          }`}
        >
          {uploading ? (
            /* Uploading State */
            <div className="animate-fade-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-sage animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-charcoal font-medium text-sm sm:text-base">Uploading...</p>
              <p className="text-xs sm:text-sm text-charcoal/50 mt-1">Please wait</p>
            </div>
          ) : (
            /* Default State */
            <>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                dragActive ? 'bg-sage/20' : 'bg-cream'
              }`}>
                {dragActive ? (
                  <HiCloudUpload className="w-7 h-7 sm:w-8 sm:h-8 text-sage animate-bounce" />
                ) : (
                  <HiPhotograph className="w-7 h-7 sm:w-8 sm:h-8 text-mist" />
                )}
              </div>
              <p className="text-charcoal font-medium text-sm sm:text-base mb-1">
                {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs sm:text-sm text-charcoal/50">
                JPG, PNG, WebP (max 10MB)
              </p>
              
              {/* Hidden file input */}
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/*" 
                onChange={handleUpload} 
                hidden 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}