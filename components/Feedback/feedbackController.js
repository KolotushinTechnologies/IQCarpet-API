// Initialize Feedback Model
const FeedbackModel = require("./feedback");

class FeedbackController {
  // * @route   GET http://localhost:5000/api/v1/feedback/test
  // * @desc    Feedback route testing
  // * @access  Public
  async test(req, res) {
    try {
      res.status(200).json({
        statusCode: 200,
        stringStatus: "Success",
        message: "Feedback route testing was successfully!",
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

  // * @route   POST http://localhost:5000/api/v1/feedback/send
  // * @desc    Send request for feedback
  // * @access  Public
  async sendRequestForFeedback(req, res) {
    try {
      const { name, email, comment } = req.body;

      // TODO: Сделать валидацию для всех полей

      if (name === "" || email === "" || comment === "") {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message: "Необходимо заполнить все поля!",
        });
      }

      await FeedbackModel.create({
        name: name,
        email: email,
        comment: comment,
      });

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message:
          "Ваше обращение было Успешно отправлено! Скоро мы с Вами свяжемся!",
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

module.exports = new FeedbackController();
