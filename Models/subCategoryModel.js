import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }, // Referenced to Category
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate subcategories in the same category
SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
