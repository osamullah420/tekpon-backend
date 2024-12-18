import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  { timestamps: true }
);

// Middleware to delete related subcategories and software
categorySchema.pre("remove", async function (next) {
  const SubCategory = mongoose.model("SubCategory");
  const Software = mongoose.model("Software");

  // Delete subcategories linked to this category
  const subCategories = await SubCategory.find({ category: this._id });
  for (const subCategory of subCategories) {
    await subCategory.remove(); // This will trigger subcategory's pre hook
  }

  // Delete software directly linked to this category (optional redundancy)
  await Software.deleteMany({ category: this._id });

  next();
});

// Use the existing model if it exists; otherwise, create a new one
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
