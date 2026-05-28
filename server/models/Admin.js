import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, default: 'مدير' }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
