import memoize from 'lru-memoize';
import { createValidator, required, email, minLength } from 'utils/validation'; // eslint-disable-line

const PostFormValidation = createValidator({
  email: [required, email],
  password: [required, minLength(8)],
  sign_up_email: [required, email],
  sign_up_password: [required, minLength(8)],
  first_name: [required],
  last_name: [required],
});
export default memoize(10)(PostFormValidation);
