import express from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { uploadMultiple, uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadMultiple, uploadImages);
router.post('/single', uploadSingle, uploadImages);
router.delete('/:publicId(*)', deleteImage);

export default router;