import mongoose from 'mongoose';

const validateObjectId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  if (req.params.artworkId && !mongoose.Types.ObjectId.isValid(req.params.artworkId)) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  if (req.params.addressId && !mongoose.Types.ObjectId.isValid(req.params.addressId)) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  next();
};

export default validateObjectId;