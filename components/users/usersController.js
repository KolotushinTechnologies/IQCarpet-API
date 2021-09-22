class UsersController {
  // * @route   GET http://localhost:5000/api/v1/users/test
  // * @desc    User route testing
  // * @access  Public
  async test(req, res) {
    try {
      res.status(200).json({
        statusCode: 200,
        stringStatus: "Success",
        message: "Users route testing was successfully!",
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

module.exports = new UsersController();
