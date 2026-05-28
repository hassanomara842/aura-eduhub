import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String },
  status: { type: String, default: 'جديد' }
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
