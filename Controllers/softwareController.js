import Category from "../models/categoryModel.js";
import Software from "../models/softwareModel.js";

export const addSoftware = async (req, res) => {
  const { name, description, subCategory, category, score } = req.body;

  try {
    // Validate required fields
    if (
      !name ||
      !description ||
      !subCategory ||
      !category ||
      score === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, description, subCategory, category, and score) are required.",
      });
    }

    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 10.",
      });
    }

    // Check if software with the same name and subCategory already exists
    const existingSoftware = await Software.findOne({
      name: name,
      subCategory: subCategory,
    });

    if (existingSoftware) {
      return res.status(400).json({
        success: false,
        message: "Software with this name already exists in the subcategory.",
      });
    }

    // Create a new software entry
    const newSoftware = new Software({
      name,
      description,
      subCategory,
      category,
      score,
      imageUrl: req.file.path,
    });

    // Save the software in the database
    await newSoftware.save();

    res.status(201).json({
      success: true,
      message: "Software added successfully",
      data: newSoftware,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add software",
      error: error.message,
    });
  }
};

export const getTopSoftwareByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const topSoftware = await Software.find({ category: categoryId })
      .populate({
        path: "subCategory",
        select: "name",
      })
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(6); // Limit to 6

    res.status(200).json({
      success: true,
      message: "software fetched sucessfully",
      data: {
        topSoftware,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "failed to fetch the softwares!",
      error: error.message,
    });
  }
};
