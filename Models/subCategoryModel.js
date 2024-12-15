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

// Middleware to delete related software
SubCategorySchema.pre("remove", async function (next) {
  const Software = mongoose.model("Software");

  // Delete software linked to this subcategory
  await Software.deleteMany({ subCategory: this._id });

  next();
});

SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });
SubCategorySchema.index({ category: 1 });
SubCategorySchema.index({ name: "text", description: "text" });

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
