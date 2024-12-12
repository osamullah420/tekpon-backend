import Category from "../Models/categoryModel.js";
import SubCategory from "../Models/subCategoryModel.js";

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
      .select("_id name")
      .sort({ name: 1 });

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

export const addSubCategory = async (req, res) => {
  const { name, description, categoryId } = req.body;

  try {
    // Check if all fields are provided
    if (!name || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, categoryId) are required.",
      });
    }

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check if the subcategory already exists in this category
    const existingSubCategory = await SubCategory.findOne({
      name: name.trim(),
      category: categoryId,
    });

    if (existingSubCategory) {
      return res.status(409).json({
        success: false,
        message:
          "Subcategory with the same name already exists in this category.",
      });
    }

    // Create a new subcategory
    const newSubCategory = new SubCategory({
      name: name.trim(),
      description: description.trim(),
      category: categoryId,
    });

    await newSubCategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategory added successfully.",
      data: newSubCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add subcategory.",
      error: error.message,
    });
  }
};

export const getTopSubCategories = async (req, res) => {
  try {
    const topSubCategories = await SubCategory.aggregate([
      {
        $lookup: {
          from: "softwares",
          localField: "_id",
          foreignField: "subCategory",
          as: "softwares",
        },
      },

      {
        $unwind: {
          path: "$softwares",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          averageScore: { $avg: "$softwares.score" },
        },
      },
      {
        $sort: { averageScore: -1 },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Top subcategories fetched successfully",
      data: {
        subCategories: topSubCategories,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch the top subcategories!",
      error: error.message,
    });
  }
};
