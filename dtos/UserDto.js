module.exports = class UserDto {
  login;
  email;
  roles;
  id;

  constructor(model) {
    this.login = model.login;
    this.email = model.email;
    this.roles = model.roles;
    this.id = model._id;
  }
};
