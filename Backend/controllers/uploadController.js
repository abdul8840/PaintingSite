import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Upload image(s)
// @route   POST /api/upload
export const uploadImages = async (req, res) => {
  try {
    if (!req.files && !req.file) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const files = req.files || [req.file];
    const folder = req.body.folder || 'sketchmint/general';
    const uploaded = [];

    for (const file of files) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const result = await uploadToCloudinary(dataURI, folder);
      uploaded.push(result);
    }

    res.json({ success: true, images: uploaded });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/:publicId
export const deleteImage = async (req, res) => {
  try {
    // Public ID may contain slashes, so reconstruct it
    const publicId = req.params.publicId + (req.params[0] ? '/' + req.params[0] : '');
    await deleteFromCloudinary(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};