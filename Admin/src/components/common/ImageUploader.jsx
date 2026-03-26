import { useState, useRef } from 'react';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';
import { HiCloudUpload, HiX } from 'react-icons/hi';

export default function ImageUploader({ 
  value, 
  onChange, 
  folder = 'sketchmint/general', 
  label = 'Upload Image' 
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef();
  const toast = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { 
      toast.error('File too large (max 10MB)'); 
      return; 
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      const res = await uploadApi.uploadSingle(formData);
      onChange(res.images[0]);
      toast.success('Image uploaded!');
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="w-full">
      <label className="
        block
        text-sm font-medium
        text-text-primary
        mb-2
      ">
        {label}
      </label>
      
      {value?.url ? (
        <div className="
          relative
          inline-block
          rounded-xl
          overflow-hidden
          border-2 border-border-light
          bg-bg-secondary
          group
        ">
          <img 
            src={value.url} 
            alt="Uploaded" 
            className="
              max-w-[200px] max-h-[200px]
              sm:max-w-[250px] sm:max-h-[250px]
              object-cover
            " 
          />
          <div className="
            absolute inset-0
            bg-black/50
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            flex items-center justify-center
          ">
            <button 
              type="button" 
              onClick={() => onChange(null)}
              className="
                flex items-center gap-2
                px-4 py-2
                bg-error hover:bg-red-600
                text-white text-sm font-medium
                rounded-lg
                transition-colors duration-200
                cursor-pointer
              "
            >
              <HiX className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative
            border-2 border-dashed rounded-xl
            p-6 sm:p-8 lg:p-10
            text-center
            transition-all duration-200
            ${dragActive 
              ? 'border-theme-primary bg-bg-tertiary' 
              : 'border-border-medium hover:border-theme-secondary hover:bg-bg-secondary'
            }
          `}
        >
          <button 
            type="button" 
            onClick={() => fileRef.current?.click()} 
            disabled={uploading}
            className="
              flex flex-col items-center justify-center
              w-full
              cursor-pointer
              disabled:cursor-not-allowed
              disabled:opacity-50
              focus-ring
              rounded-lg
            "
          >
            <div className={`
              w-12 h-12 sm:w-14 sm:h-14
              mb-3
              rounded-full
              flex items-center justify-center
              transition-colors duration-200
              ${uploading 
                ? 'bg-bg-tertiary' 
                : 'bg-bg-tertiary group-hover:bg-bg-hover'
              }
            `}>
              <HiCloudUpload className={`
                w-6 h-6 sm:w-7 sm:h-7
                text-text-muted
                ${uploading ? 'animate-pulse' : ''}
              `} />
            </div>
            <span className="
              text-sm sm:text-base
              font-medium
              text-text-primary
              mb-1
            ">
              {uploading ? 'Uploading...' : 'Choose Image'}
            </span>
            <span className="text-xs sm:text-sm text-text-muted">
              or drag and drop here
            </span>
            <span className="text-xs text-text-muted mt-2">
              PNG, JPG, WEBP up to 10MB
            </span>
          </button>
        </div>
      )}
      
      <input 
        ref={fileRef} 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        hidden 
      />
    </div>
  );
}