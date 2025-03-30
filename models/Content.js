import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Model',
      required: [true, 'Please provide a model ID'],
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Please provide a thumbnail URL'],
    },
    contentType: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Please specify content type'],
    },
    isPremium: {
      type: Boolean,
      default: false,
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

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);