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

SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });
SubCategorySchema.index({ category: 1 });
SubCategorySchema.index({ name: "text", description: "text" });

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
