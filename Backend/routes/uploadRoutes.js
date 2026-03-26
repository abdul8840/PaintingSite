import express from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { uploadMultiple, uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadMultiple, uploadImages);
router.post('/single', uploadSingle, uploadImages);
// Handle nested public IDs like "sketchmint/artworks/abc123"
router.delete('/:folder/:subfolder/:publicId', deleteImage);
router.delete('/:folder/:publicId', deleteImage);

export default router;