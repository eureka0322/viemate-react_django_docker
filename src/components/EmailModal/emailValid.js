import memoize from 'lru-memoize';
import { createValidator, required, email, match } from 'utils/validation';

const PostFormValidation = createValidator({
  email: [required, email, match('email_confirm')],
  email_confirm: [required, email, match('email')]
});
export default memoize(10)(PostFormValidation);
