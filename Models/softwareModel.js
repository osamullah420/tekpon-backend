import mongoose from "mongoose";

const SoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  score: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "SubCategory",
    required: true,
  }, // Referenced to SubCategory
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate software in the same subcategory
SoftwareSchema.index({ subCategory: 1, score: -1 });
SoftwareSchema.index({ name: 1, subCategory: 1 }, { unique: true });

const Software = mongoose.model("Software", SoftwareSchema);

export default Software;
