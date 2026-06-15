import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().hostname().default('localhost'),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  DB_AUTOLOAD: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_TOKEN_TTL: Joi.number().default(3600),
});
