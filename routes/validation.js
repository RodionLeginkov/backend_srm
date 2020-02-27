const Joi = require("@hapi/joi")

//Register Validation

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(6)
  });
  return schema.validate(data);
}

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(6)
  });
  return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;