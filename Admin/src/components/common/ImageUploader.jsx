import { useState, useRef } from 'react';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';
import { HiCloudUpload, HiX } from 'react-icons/hi';

export default function ImageUploader({ value, onChange, folder = 'sketchmint/general', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
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

  return (
    <div>
      <label>{label}</label>
      {value?.url ? (
        <div>
          <img src={value.url} alt="" style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }} />
          <button type="button" onClick={() => onChange(null)}><HiX /> Remove</button>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <HiCloudUpload /> {uploading ? 'Uploading...' : 'Choose Image'}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} hidden />
    </div>
  );
}