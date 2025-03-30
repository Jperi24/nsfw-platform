import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a model name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Please provide a thumbnail URL'],
    },
    contentCount: {
      type: Number,
      default: 0,
    },
    premiumContentCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Model || mongoose.model('Model', ModelSchema);