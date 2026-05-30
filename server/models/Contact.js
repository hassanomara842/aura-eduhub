import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, default: 'استفسار عام' },  // optional — مش required
  message: { type: String },
  status: { type: String, default: 'جديد' },
  submittedAt: { type: Date, default: Date.now }       // يُحفظ من الـ frontend أو يُولَّد تلقائياً
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
