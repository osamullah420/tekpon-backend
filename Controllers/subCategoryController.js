import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";

export const getSubCategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Fetch only 6 subcategories, sorted alphabetically by name
    const subCategories = await SubCategory.find({ category: categoryId })
      .select("name description")
      .sort({ name: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: {
        subCategories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch the subcategories!",
      error: error.message,
    });
  }
};

export const getAllSubCategories = async (req, res) => {
  const { page = 1 } = req.query; // Default to page 1 if no page is provided
  const limit = 24; // Subcategories per page

  try {
    // Fetch subcategories with pagination
    const subCategories = await SubCategory.find()
      .select("name description category") // fields to dislplay
      .sort({ name: 1 })
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    // Count the total number of subcategories for pagination metadata
    const totalCount = await SubCategory.countDocuments();

    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: {
        subCategories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories!",
      error: error.message,
    });
  }
};
