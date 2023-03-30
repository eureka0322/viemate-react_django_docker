import memoize from 'lru-memoize';
import { createValidator, required, email } from 'utils/validation'; // eslint-disable-line

const EmailValidation = createValidator({
  email: [required, email],
});
export default memoize(10)(EmailValidation);
