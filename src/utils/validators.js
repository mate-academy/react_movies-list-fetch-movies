import { URL_REGEXP } from '../constants/validation';

export const required = (name, value) => (
  value
    ? null
    : `Field ${name} is required`
);

export const url = (name, value) => (
  value.match(URL_REGEXP)
    ? null
    : `Field ${name} should be a valid url`
);

export const composeValidators = (...validators) => (name, value) => validators
  .reduceRight((prevError, validatorFn) => (
    prevError || validatorFn(name, value)
  ), null);
