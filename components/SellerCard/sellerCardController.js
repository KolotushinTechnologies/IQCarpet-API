// Initialize Seller Card Model
const SellerCardModel = require("./sellerCard");

class SellerCardController {
  // * @route   GET http://localhost:5000/api/v1/seller-card/test
  // * @desc    Seller Card route testing
  // * @access  Public
  async test(req, res) {
    try {
      res.status(200).json({
        statusCode: 200,
        stringStatus: "Success",
        message: "Seller Card route testing was successfully!",
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

  // * @route   GET http://localhost:5000/api/v1/seller-card/my-seller-card
  // * @desc    Get my seller card
  // * @access  Private
  async mySellerCard(req, res) {
    try {
      const userSellerCard = await SellerCardModel.findOne({
        user: req.user.id,
      });

      if (!userSellerCard) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Профиль продавца не найден!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: userSellerCard,
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

  // * @route   PUT http://localhost:5000/api/v1/seller-card/my-seller-card/settings
  // * @desc    Seller Card settings
  // * @access  Private
  // async mySellerCardSettings(req, res) {
  //   try {
  //     const userSellerCard = await SellerCardModel.findOne({ user: req.user.id });

  //     if (!userSellerCard) {
  //       return res.status(404).json({
  //         statusCode: 404,
  //         stringStatus: "Not Found",
  //         message: "Профиль продавца не найден!",
  //       });
  //     }

  //     const { phoneNumberTwo, emailTwo } = req.body;

  //   } catch(err) {
  //     res.status(500).json({
  //       statusCode: 500,
  //       stringStatus: "Error",
  //       message: `Something went wrong! ${err}`,
  //     });
  //     console.log({
  //       statusCode: 500,
  //       stringStatus: "Error",
  //       message: `Something went wrong! ${err}`,
  //     });
  //   }
  // }
}

module.exports = new SellerCardController();
