import Category from "../Models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories, sorted alphabetically
    const categories = await Category.find().select("name").sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories!",
      error: error.message,
    });
  }
};

export const getAllCategoriesWithDescription = async (req, res) => {
  try {
    // Fetch all categories, sorted alphabetically
    const categories = await Category.find()
      .select("_id name description")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories!",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    // Fetch all categories, sorted alphabetically
    const category = await Category.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category!",
      error: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Validate input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Both name and description are required.",
      });
    }

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with the same name already exists.",
      });
    }

    // Create and save the new category
    const newCategory = new Category({
      name: name.trim(),
      description: description.trim(),
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully.",
      data: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add category.",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  try {
    // Validate input with safe fallback
    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both name and description are required.",
      });
    }

    // Find and update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: name.trim(), description: description.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update category.",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Remove the category (triggers pre middleware to handle related deletions)
    await Category.remove;

    res.status(200).json({
      success: true,
      message:
        "Category and all related subcategories and software deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category.",
      error: error.message,
    });
  }
};
