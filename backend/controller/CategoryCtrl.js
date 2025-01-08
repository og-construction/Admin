const ProductCategory = require("../models/CategoryModel");
const Subcategory = require("../models/SubCategory"); // Ensure this path is correct
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newProductCategory = await ProductCategory.create(req.body);
        res.json(newProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updatedProductCategory = await ProductCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);
        res.json(deletedProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const productCategory = await ProductCategory.findById(id);
        res.json(productCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const allProductCategories = await ProductCategory.find();
        res.json(allProductCategories);
    } catch (error) {
        throw new Error(error);
    }
});

// New function to seed categories and subcategories
const seedCategoriesAndSubcategories = asyncHandler(async (req, res) => {
    const categoriesData = [
        {
            name: 'Hand Tools',
            subcategories: ['Manual Hand Tools', 'Electronics Hand Tools', 'Hydrolic Hand Tools'],
        },
        {
            name: 'Small Equipment',
            subcategories: ['Mechanise', 'Manual', 'Electrical Small Equipment', 'Hydrolic Small Equipment'],
        },
        {
            name: 'Heavy Equipment',
            subcategories: ['Diesel Operation Syetem', 'Electrical Operating System'],
        },
        {
            name: 'Construction Chemicals',
            subcategories: ['Adduces', 'Admixer Type'],
        },
        {
            name: 'Bulk Material',
            subcategories: [
                {
                    name: 'Cement',
                    specifications:[
                        {
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                            key:  'type', value:' ',
                        }
                    ]
                }
            ]
        },
        {
            name: 'Finishing Items',
            subcategories: ['Paint', 'Tiles', 'Door Window', 'Grills','Toilet','wcpc','Plumbing and Sanitary'],
        },
        {
            name: 'Form Work Material',
            subcategories: ['Type of Form Work Material'],
        },
    ];

    try {
        // Clear existing data
        await ProductCategory.deleteMany();
        await Subcategory.deleteMany();

        // Create categories and their subcategories
        for (const categoryData of categoriesData) {
            const category = await ProductCategory.create({ name: categoryData.name });

            const subcategories = categoryData.subcategories.map(subcat => {
                return { name: subcat, category: category._id };
            });

            await Subcategory.insertMany(subcategories);
        }

        res.json({ message: 'Categories and subcategories created successfully!' });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
    seedCategoriesAndSubcategories, // Export the new function
    validateMongodbId,
};
