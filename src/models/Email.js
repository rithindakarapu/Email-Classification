import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  id: { type: String, required: true },
  threadId: { type: String, required: true },
  snippet: { type: String },
  internalDate: { type: Date },
  payload: { type: Object },
});

const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);
export default Email;
