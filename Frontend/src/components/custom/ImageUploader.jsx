import { useState, useRef } from 'react';
import { HiCloudUpload, HiX, HiPhotograph } from 'react-icons/hi';
import uploadApi from '../../api/uploadApi';
import { useToast } from '../../hooks/useToast';

export default function ImageUploader({ value, onChange, label = 'Upload Reference Image' }) {
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

  const handleRemove = () => onChange(null);

  return (
    <div>
      <label>{label}</label>
      {value?.url ? (
        <div>
          <img src={value.url} alt="Reference" />
          <button onClick={handleRemove}><HiX /></button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()}>
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <HiPhotograph />
              <p>Click to upload or drag and drop</p>
              <p>JPG, PNG, WebP (max 10MB)</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} hidden />
        </div>
      )}
    </div>
  );
}