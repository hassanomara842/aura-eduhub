import mongoose from 'mongoose';

const customSectionSchema = new mongoose.Schema({
  title: String,
  content: String
}, { _id: false });

const scholarshipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  country: { type: String, required: true },
  coverage: { type: String, required: true },
  deadline: { type: String, required: true },
  image: { type: String },
  officialLink: { type: String },
  content: {
    customSections: [customSectionSchema],
    targetAudience: String,
    features: String,
    majors: String,
    conditions: String,
    documents: String
  }
}, { timestamps: true });

export default mongoose.model('Scholarship', scholarshipSchema);
