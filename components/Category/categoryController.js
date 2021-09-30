// Initialize Category Model
const CategoryModel = require("./category");

class CategoryController {
  // * @route   GET http://localhost:5000/api/v1/category/test
  // * @desc    Category route testing
  // * @access  Public
  async test(req, res) {
    try {
      res.status(200).json({
        statusCode: 200,
        stringStatus: "Success",
        message: "Category route testing was successfully!",
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }

  // * @route   GET http://localhost:5000/api/v1/category
  // * @desc    Get Categories
  // * @access  Public
  async getCategories(req, res) {
    try {
      const categories = await CategoryModel.find({});

      if (!categories) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Категории не найдены!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: categories,
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }

  // * @route   GET http://localhost:5000/api/v1/category/:_id
  // * @desc    Get Category by id
  // * @access  Public
  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.findOne({ _id: req.params._id });

      if (!category) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Категория не найдена!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: category,
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }

  // * @route   POST http://localhost:5000/api/v1/category
  // * @desc    Category craete
  // * @access  Private
  async create(req, res) {
    try {
      const { name } = req.body;

      const category = await CategoryModel.findOne({ name: name });

      if (category) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message: "Название Категории уже существует!",
        });
      }

      const newCategory = await CategoryModel.create({
        name: name,
      });

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: newCategory,
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }

  // * @route   PUT http://localhost:5000/api/v1/category/:_id
  // * @desc    Category edit
  // * @access  Private
  async updateCategoryById(req, res) {
    try {
      const category = await CategoryModel.findOne({ _id: req.params._id });

      if (!category) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Категория не найдена!",
        });
      }

      const { name } = req.body;

      if (name) {
        category.name = name;
      }

      category.save();

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: category,
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }

  // * @route   DELETE http://localhost:5000/api/v1/category/:_id
  // * @desc    Category delete
  // * @access  Private
  async deleteCategoryById(req, res) {
    try {
      const category = await CategoryModel.findOne({ _id: req.params._id });

      if (!category) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Категория не найдена!",
        });
      }

      await CategoryModel.deleteOne({ _id: req.params._id });

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: `Категория ${category.name} удалена!`,
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
      console.log({
        statusCode: 500,
        stringStatus: "Error",
        message: `Something went wrong! ${err}`,
      });
    }
  }
}

module.exports = new CategoryController();
