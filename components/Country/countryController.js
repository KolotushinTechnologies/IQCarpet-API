// Initialize Country Model
const CountryModel = require("./country");

class CountryController {
  // * @route   GET http://localhost:5000/api/v1/country/test
  // * @desc    Country route testing
  // * @access  Public
  async test(req, res) {
    try {
      res.status(200).json({
        statusCode: 200,
        stringStatus: "Success",
        message: "Country route testing was successfully!",
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

  // * @route   GET http://localhost:5000/api/v1/country
  // * @desc    Get Countries
  // * @access  Public
  async getCountries(req, res) {
    try {
      const countries = await CountryModel.find({});

      if (!countries) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Старны не найдены!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: countries,
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

  // * @route   GET http://localhost:5000/api/v1/country/:_id
  // * @desc    Get Country by id
  // * @access  Public
  async getCountryById(req, res) {
    try {
      const country = await CountryModel.findOne({ _id: req.params._id });

      if (!country) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Страна не найдена!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: country,
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

  // * @route   POST http://localhost:5000/api/v1/country
  // * @desc    Country craete
  // * @access  Private
  async create(req, res) {
    try {
      const { name } = req.body;

      const country = await CountryModel.findOne({ name: name });

      if (country) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message: "Название Страны уже существует!",
        });
      }

      const newCountry = await CountryModel.create({
        name: name,
      });

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: newCountry,
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

  // * @route   PUT http://localhost:5000/api/v1/country/:_id
  // * @desc    Country edit
  // * @access  Private
  async updateCountryById(req, res) {
    try {
      const country = await CountryModel.findOne({ _id: req.params._id });

      if (!country) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Страна не найдена!",
        });
      }

      const { name } = req.body;

      if (name) {
        country.name = name;
      }

      country.save();

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: country,
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

  // * @route   DELETE http://localhost:5000/api/v1/country/:_id
  // * @desc    Country delete
  // * @access  Private
  async deleteCountryById(req, res) {
    try {
      const country = await CountryModel.findOne({ _id: req.params._id });

      if (!country) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Страна не найдена!",
        });
      }

      await CountryModel.deleteOne({ _id: req.params._id });

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: `Страна ${country.name} удалена!`,
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

module.exports = new CountryController();
