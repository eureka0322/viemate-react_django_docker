import memoize from 'lru-memoize';
import { createValidator, minLength, match } from 'utils/validation';

const settingsValidation = createValidator({
  password: [minLength(7)],
  password_confirmation: [minLength(7), match('password')]
});
export default memoize(10)(settingsValidation);
