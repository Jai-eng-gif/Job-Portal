import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true },
  appliedDate: { type: Date, default: Date.now },
  coverLetter: { type: String, required: true },
  resume: {
    data: String,
    contentType: String,
    originalName: String
  }
  
});

export const Application = mongoose.model('Application', applicationSchema);
