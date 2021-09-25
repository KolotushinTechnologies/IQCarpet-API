const bcrypt = require("bcrypt");

// Initialize User Model
const UserModel = require("./user");

// Initialize Role Model
const RoleModel = require("../roles/RoleModel");

// Initialize Token Service
const TokenService = require("../../utils/jwt/TokenService/tokenService");

// Initialize User DTO
const UserDto = require("../../dtos/UserDto");

// Connecting validation for forms
const validateUsersEmailValidationBasicInput = require("../../utils/validation/users/usersEmailValidationBasic");

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

  // * @route   POST http://localhost:5000/api/v1/users/registration
  // * @desc    User registration
  // * @access  Public
  async registration(req, res) {
    try {
      // First section
      const { errors, isValid } = validateUsersEmailValidationBasicInput(
        req.body
      );

      // Validation
      if (!isValid) {
        return res.status(400).json({
          statusCode: "400",
          stringStatus: "Error",
          message: errors,
        });
      }

      // Second section
      const {
        fullname,
        iAmSeller,
        companyName,
        birthDay,
        location,
        phoneNumber,
        login,
        email,
        password,
      } = req.body;

      // Проведем поиск среди существующих и не существующих пользователей по взятому email из тела запроса
      const userCandidate = await UserModel.findOne({ email: email });

      if (userCandidate) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Error",
          message: "Пользователь с таким email уже существует!",
        });
      }

      // Если регистрируется покупатель, то регистрируем покупателя
      if (!iAmSeller || iAmSeller === "" || iAmSeller === null) {
        // Находим роль "USER", которая явялется базовой для всех пользователей,
        // чтобы присвоить ее нвоому пользователю
        const userRoleCustomerUSER = await RoleModel.findOne({ value: "USER" });
        // TODO: Оптимизировать
        const userRoleCustomerCUSTOMER = await RoleModel.findOne({
          value: "CUSTOMER",
        });

        // Создаем нового пользователя, записываем его введеный email в теле запроса,
        // записываем базовую для всех пользователей роль, которую мы нашли в Базе Данных ролей пользователей
        const newUserCustomer = await UserModel.create({
          fullname: fullname,
          iAmSeller:
            !iAmSeller || iAmSeller === "" || iAmSeller === null ? false : true,
          birthDay: birthDay,
          location: location,
          phoneNumber: phoneNumber,
          login: login,
          email: email,
          password: password,
          roles: [userRoleCustomerUSER.value, userRoleCustomerCUSTOMER.value],
        });

        // Возвращаем успешный статус с ответом от сервера и данными о пользователе
        return res.status(200).json({
          statusCode: 200,
          stringStatus: "Success, OK",
          message: {
            serverMessage: "Добро пожаловать в IQCarpet!",
            userData: {
              fullname: newUserCustomer.fullname,
              birthDay: newUserCustomer.birthDay,
              location: newUserCustomer.location,
              phoneNumber: newUserCustomer.phoneNumber,
              login: newUserCustomer.login,
              email: newUserCustomer.email,
              roles: newUserCustomer.roles,
            },
          },
        });
      }

      // Если регистрируется продавец(Компания), то регистрируем продавца(Компанию)
      // Находим роль "USER", которая явялется базовой для всех пользователей,
      // чтобы присвоить ее нвоому пользователю
      const userRoleSellerrUSER = await RoleModel.findOne({ value: "USER" });
      // TODO: Оптимизировать
      const userRoleSellerCUSTOMER = await RoleModel.findOne({
        value: "SELLER",
      });

      // Создаем нового пользователя, записываем его введеный email в теле запроса,
      // записываем базовую для всех пользователей роль, которую мы нашли в Базе Данных ролей пользователей
      const newUserSeller = await UserModel.create({
        fullname: fullname,
        iAmSeller: iAmSeller,
        companyName: companyName,
        birthDay: birthDay,
        location: location,
        phoneNumber: phoneNumber,
        login: login,
        email: email,
        password: password,
        roles: [userRoleSellerrUSER.value, userRoleSellerCUSTOMER.value],
      });

      // Возвращаем успешный статус с ответом от сервера и данными о пользователе
      return res.status(200).json({
        statusCode: 200,
        stringStatus: "Success, OK",
        message: {
          serverMessage: "Добро пожаловать в IQCarpet!",
          userData: {
            fullname: newUserSeller.fullname,
            birthDay: newUserSeller.birthDay,
            location: newUserSeller.location,
            phoneNumber: newUserSeller.phoneNumber,
            login: newUserSeller.login,
            email: newUserSeller.email,
            roles: newUserSeller.roles,
          },
        },
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

  // * @route   POST http://localhost:5000/api/v1/users/login
  // * @desc    User login
  // * @access  Public
  async login(req, res) {
    try {
      // Получаем email и login из тела запроса
      // TODO: Исправить поле для проверки login и email на одно поле login или username
      const { email, login, password } = req.body;

      // Находим пользователя по email или login из тела запроса,
      // чтобы установить правильность ввода данных
      const user = await UserModel.findOne({
        $or: [{ email: email }, { login: login }],
      });

      // Если такого пользователя не существует, то выдаем ошибку 404,
      // где сообщаем о том, что пользователь не найден и просим проверить правильность запроса
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message:
            "Пользователь не найден! Пожалуйста, проверьте правильность запроса!",
        });
      }

      if (user.password !== password) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Error",
          message: "Неправильный пароль! Пожалуйста, введите пароль еще раз!",
        });
      }

      // Если пароль верный, то выполняем авторизацию

      // Получаем нужные поля из нашей модели, которые нам нужны для генерации access и refresh токенов,
      // а также для ответа запроса пользователю
      const userDto = new UserDto(user);

      // Генерируем пару access и refresh токенов с помощью полей, которые указаны в userDto
      // login, email, roles, id
      const tokens = TokenService.generateTokens({ ...userDto });

      // Сохраняем refreshToken в Базе Данных, где привязывается _id пользователя, который владеет refreshToken
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      // Отправляем в cookies refreshToken, чтобы можно было после обновлять access и refresh токены у пользователя по запросу,
      // также в cookie ставим максимальный срок жизни, в данном случае он идет почти 30(29) дней
      // и поле httpOnly ставим в значение true, чтобы при запросах никто не мог получить доступ к данным cookies,
      // которые мы начали хранить
      res.cookie(`refreshToken`, tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      // Возвращаем Успешный статус 200 OK, Success, возвращаем пару токенов access и refresh и данные о пользователе
      // login, email, roles, id
      return res.status(200).json({
        statusCode: 200,
        stringStatus: "Succes, OK",
        message: {
          ...tokens,
          user: userDto,
        },
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
