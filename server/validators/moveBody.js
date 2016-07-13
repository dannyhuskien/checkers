/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  startx: joi.number().min(0).max(7),
  starty: joi.number().min(0).max(7),
  tox: joi.number().min(0).max(7),
  toy: joi.number().min(0).max(8),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: ['Invalid move - out of board range'] });
  } else {
    res.locals = result.value;
    next();
  }
};
