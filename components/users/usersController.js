const bcrypt = require("bcrypt");
const fs = require("fs");

// Initialize User Model
const UserModel = require("./user");

// Initialize Role Model
const RoleModel = require("../roles/RoleModel");

// Initialize Avatar Model
const AvatarModel = require("../files/Avatars/avatar");

// Initialize Seller Model
const SellerCardModel = require("../SellerCard/sellerCard");

// Initialize Generate Email Verify Code (Utils)
const generateEmailVerifyCode = require("../../utils/generate/generateEmailVerifyCode/generateEmailVerifyCode");

// Initialize Token Service
const TokenService = require("../../utils/jwt/TokenService/tokenService");

// Initialize Mail Service
const MailService = require("../Mail/MailService");

// Initialize User DTO
const UserDto = require("../../dtos/UserDto");

// Initialize Avatar DTO
const AvatarDto = require("../../dtos/AvatarDto");

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

      // TODO: Сделать создание Карточки Продавца
      const newSellerCard = await SellerCardModel.create({
        iAmSeller: newUserSeller.iAmSeller,
        companyName: newUserSeller.companyName,
        location: newUserSeller.location,
        phoneNumberOne: newUserSeller.phoneNumber,
        // avatar:
        emailOne: newUserSeller.email,
        user: newUserSeller._id,
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
          sellerCardData: {
            sellerStatus: newSellerCard.iAmSeller,
            companyName: newSellerCard.companyName,
            location: newSellerCard.location,
            phoneNumberOne: newSellerCard.phoneNumberOne,
            emailOne: newSellerCard.emailOne,
            user: newSellerCard.user._id,
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

  // * @route   POST http://localhost:5000/api/v1/users/reset-password-send-code
  // * @desc    User reset password send code
  // * @access  Public
  async resetPasswordSendCode(req, res) {
    try {
      const { email } = req.body;

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Пользователь с таким email не найден!",
        });
      }

      // Если пользователь с таким email уже существует,
      // то пересоздадим код для подтверждения входа в аккаунт IQCarpet
      await UserModel.updateOne(
        { email: email },
        {
          $set: {
            emailVerifyCode: generateEmailVerifyCode().toString(),
          },
        }
      );

      // Находим существующего c аккаунтом IQCarpet пользователя,
      // чтобы отправить код для подтверждения входа в аккаунт IQCarpet
      const existingUser = await UserModel.findOne({ email: email });

      // Отправляем на email пользователя код для подтверждения смены пароля в аккаунте IQCarpet
      await MailService.sendCodeForConfirmResetPassword(
        email,
        existingUser.emailVerifyCode
      );

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message:
          "Для смены пароля Вам необходимо ввести код в форму, который пришел на укзанную раннее Вами почту!",
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

  // * @route   POST http://localhost:5000/api/v1/users/reset-password
  // * @desc    User reset password
  // * @access  Public
  async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message:
            "Пользовательне найден! Пожалуйста, проверьте правильность запроса!",
        });
      }

      // TODO: Сделать валидацию для проверкт пароля
      // TODO: Сделать шифрование паролей

      if (user.emailVerifyCode === code && user.emailVerifyCode !== "") {
        // Обновляем модель пользователя, находим пользователя по его _id, email и выполняем это обновление,
        // если у пользователя верный код подтверждения для смены пароля
        // На место поля emailVerifyCode, где ддолжен быть код для смены пароля, мы ставим пустую строку.
        // Это нужно для безопасности пользователя, чтобы никто не мог сменить пароль по старому коду для подтверждения смены пароля
        // На место поля password у пользователя мы ставим новый пароль, который пользователь придумал и отправил вместе с кодом и email
        // через поле тела запроса newPassword
        await UserModel.updateOne(
          { _id: user._id, email: email },
          {
            $set: {
              emailVerifyCode: "",
              password: newPassword,
            },
          }
        );

        // Возвращаем Успешный статус 200 OK, Success
        return res.status(200).json({
          statusCode: 200,
          stringStatus: "OK, Success",
          message: "Поздравляем! Вы Успешно сменили пароль!",
        });
      } else if (user.emailVerifyCode !== code && user.emailVerifyCode !== "") {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message:
            "Код введен неверно! Пожалуйста, попробуйте еще раз ввести код!",
        });
      } else if (
        (user.emailVerifyCode === "" && code === "") ||
        code ||
        !code
      ) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message: "Пожалуйста, проверьте правильность запроса!",
        });
      } else {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message:
            "Что-то пошло не так! Пожалуйста, проверьте правильность запроса!",
        });
      }
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

  // * @route   POST http://localhost:5000/api/v1/users/my-profile/settings/upload-avatar
  // * @desc    Post my profile for my settings Upload Avatar(My Profile Settings Upload Logo)
  // * @access  Private
  // TODO: Сделать удаление фото
  async myProfileSettingsUploadAvatar(req, res) {
    try {
      const avatar = await AvatarModel.findOne({ user: req.user.id });

      if (!avatar) {
        const { file } = req;

        if (!file) {
          return res.status(400).json({
            statusCode: 400,
            stringStatus: "Bad Request",
            message:
              "Поле с файлом не найдено! Пожалуйста, проверьте корректность запроса!",
          });
        }

        const ext = file.originalname.split(".").pop();

        const newAvatar = await AvatarModel.create({
          filename: file.path.split("\\").pop(),
          ext: ext,
          url: `${req.protocol}://${
            req.headers.host
          }/files/images/avatars/${file.path.split("\\").pop()}`,
          user: req.user.id,
        });

        const avatarDto = new AvatarDto(newAvatar);

        await UserModel.updateOne(
          { _id: req.user.id },
          {
            $set: {
              avatar: avatarDto.id,
            },
          }
        );

        return res.status(200).json({
          statusCode: 200,
          stringStatus: "OK, Success",
          message: {
            user: avatarDto.user,
            avatar: avatarDto,
          },
        });
      }

      fs.unlink(
        `./public/files/images/avatars/${avatar.filename}`,
        function (err) {
          if (err) {
            console.log(err);
            return res.status(400).json({
              statusCode: 400,
              stringStatus: "Bad Request",
              message: `Something went wrong! ${err}`,
            });
          }
        }
      );

      await AvatarModel.deleteOne({ user: req.user.id });

      const { file } = req;

      if (!file) {
        return res.status(400).json({
          statusCode: 400,
          stringStatus: "Bad Request",
          message: "Поле с файлом не найдено!",
        });
      }

      const ext = file.originalname.split(".").pop();

      const newAvatar = await AvatarModel.create({
        filename: file.path.split("\\").pop(),
        ext: ext,
        url: `${req.protocol}://${
          req.headers.host
        }/files/images/avatars/${file.path.split("\\").pop()}`,
        user: req.user.id,
      });

      const avatarDto = new AvatarDto(newAvatar);

      await UserModel.updateOne(
        { _id: req.user.id },
        {
          $set: {
            avatar: avatarDto.id,
          },
        }
      );

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: {
          user: avatarDto.user,
          avatar: avatarDto,
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

  // **************************************
  // *** CUSTOMER SECTION (CRUD SYSTEM) ***
  // **************************************

  // * @route   GET http://localhost:5000/api/v1/users/my-customer-profile
  // * @desc    Get customer profile for customer(My Customer Profile)
  // * @access  Private
  async myCustomerProfile(req, res) {
    try {
      const user = await UserModel.findOne({
        _id: req.user.id,
        iAmSeller: { $ne: true },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Профиль не найден!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: user,
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

  // * @route   PUT http://localhost:5000/api/v1/users/my-customer-profile/settings
  // * @desc    Put customer profile for customer settings(My Customer Profile Settings)
  // * @access  Private
  async myCustomerProfileSettings(req, res) {
    try {
      const user = await UserModel.findOne({
        _id: req.user.id,
        iAmSeller: { $ne: true },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Пользователь не найден!",
        });
      }

      const {
        fullname,
        birthDay,
        location,
        // TODO: city,
        phoneNumber,
        email,
      } = req.body;

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (fullname) {
        user.fullname = fullname;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (birthDay) {
        user.birthDay = birthDay;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (location) {
        user.location = location;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (phoneNumber) {
        user.phoneNumber = phoneNumber;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (email) {
        user.email = email;
      }

      user.save();

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: {
          _id: user._id,
          fullname: user.fullname,
          birthDay: user.birthDay,
          location: user.location,
          phoneNumber: user.phoneNumber,
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

  // ************************************
  // *** SELLER SECTION (CRUD SYSTEM) ***
  // ************************************

  // * @route   GET http://localhost:5000/api/v1/users/my-seller-profile
  // * @desc    Get seller profile for seller(My Seller Profile)
  // * @access  Private
  async mySellerProfile(req, res) {
    try {
      const user = await UserModel.findOne({
        _id: req.user.id,
        iAmSeller: { $ne: false },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Профиль не найден!",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: user,
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

  // * @route   PUT http://localhost:5000/api/v1/users/my-seller-profile/settings
  // * @desc    Put seller profile for seller settings(My Seller Profile Settings)
  // * @access  Private
  async mySellerProfileSettings(req, res) {
    try {
      const user = await UserModel.findOne({
        _id: req.user.id,
        iAmSeller: { $ne: false },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          stringStatus: "Not Found",
          message: "Пользователь не найден!",
        });
      }

      const {
        fullname,
        companyName,
        birthDay,
        location,
        // TODO: city,
        phoneNumber,
        email,
      } = req.body;

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (fullname) {
        user.fullname = fullname;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (companyName) {
        user.companyName = companyName;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (birthDay) {
        user.birthDay = birthDay;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (location) {
        user.location = location;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (phoneNumber) {
        user.phoneNumber = phoneNumber;
      }

      // TODO: Сделать валидацию для ввода символов в fullname и дургие поля,
      // сделать валидацию на пустые строки и пробелы в форме
      if (email) {
        user.email = email;
      }

      user.save();

      return res.status(200).json({
        statusCode: 200,
        stringStatus: "OK, Success",
        message: {
          _id: user._id,
          fullname: user.fullname,
          companyName: user.companyName,
          birthDay: user.birthDay,
          location: user.location,
          phoneNumber: user.phoneNumber,
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
