const mongoose = require("mongoose");
const Category = require("../Models/categoryModel");
const categories = [
  { name: "Development Tools", description: "Tools for software development" },
  { name: "Design Tools", description: "Tools for UI/UX and graphic design" },
  { name: "Cloud Services", description: "Platforms for cloud computing" },
  { name: "Project Management", description: "Tools for managing projects" },
  {
    name: "Testing Tools",
    description: "Software testing frameworks and tools",
  },
  {
    name: "AI/ML Tools",
    description: "Tools for artificial intelligence and machine learning",
  },
];

const seedCategories = async () => {
  try {
    console.log("Seeding static categories...");
    for (const category of categories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
      }
    }
    console.log("Static categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

module.exports = seedCategories;
