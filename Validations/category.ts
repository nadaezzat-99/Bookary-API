import Joi from 'joi';

const categoryData = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().trim().min(3).max(15).required(),
    }),
};

const categoryId = {
  params: Joi.object().required().keys({
    id: Joi.number(),
  }),
};

module.exports = {
  categoryData,
  categoryId,
};
