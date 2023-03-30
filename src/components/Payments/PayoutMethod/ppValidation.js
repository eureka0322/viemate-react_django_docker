import memoize from 'lru-memoize';
import { createValidator, required, email } from 'utils/validation';

const ppValidation = createValidator({
  email: [required, email]
});
export default memoize(10)(ppValidation);
