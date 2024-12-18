import Category from "../Models/categoryModel.js";
import SubCategory from "../Models/subCategoryModel.js";
import Software from "../Models/softwareModel.js";

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
      .sort({ createdAt: 1 });

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

export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).select(
      "_id name"
    );
    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: {
        subCategory,
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
export const getAllSubCategories = async (req, res) => {
  const { page = 1 } = req.query; // Default to page 1 if no page is provided
  const limit = 24; // Subcategories per page

  try {
    // Fetch paginated subcategories
    const subCategories = await SubCategory.find()
      .select("name") // Fetch only the name of the subcategories
      .sort({ name: 1 })
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    // Fetch top 4 software for each subcategory
    const subCategoriesWithTopSoftwares = await Promise.all(
      subCategories.map(async (subcategory) => {
        const topSoftwares = await Software.find({
          subCategory: subcategory._id,
        })
          .sort({ score: -1 }) // Sort by score descending
          .limit(4) // Limit to top 4
          .select("_id imageUrl"); // Include only IDs and image URLs

        return {
          name: subcategory.name,
          topSoftwares,
        };
      })
    );

    // Count the total number of subcategories for pagination metadata
    const totalCount = await SubCategory.countDocuments();

    // Construct and send the response
    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: {
        subCategories: subCategoriesWithTopSoftwares,
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

export const getAllSubCategoriesWithDescription = async (req, res) => {
  const { page = 1 } = req.query; // Default to page 1 if no page is provided
  const limit = 24; // Subcategories per page

  try {
    // Fetch paginated subcategories with their parent category
    const subCategories = await SubCategory.find()
      .select("_id name description category") // Fetch only the required fields
      .populate({
        path: "category", // Populate the 'category' field
        select: "_id name", // Fetch only the ID and name of the category
      })
      .sort({ name: 1 }) // Sort alphabetically by name
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    // Count the total number of subcategories for pagination metadata
    const totalCount = await SubCategory.countDocuments();

    // Construct and send the response
    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: {
        subCategories,
        pagination: {
          currentPage: parseInt(page, 10),
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

export const deleteSubCategory = async (req, res) => {
  const { subCategoryId } = req.params;

  try {
    const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found.",
      });
    }

    // Trigger cascading deletions
    await subCategory.remove;

    res.status(200).json({
      success: true,
      message: "SubCategory and its related software deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subcategory.",
      error: error.message,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  const { subCategoryId } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    // Validate input
    if (!name || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, categoryId) are required.",
      });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Find and update the subcategory
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      {
        name: name.trim(),
        description: description.trim(),
        category: categoryId,
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubCategory updated successfully.",
      data: updatedSubCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update subcategory.",
      error: error.message,
    });
  }
};
