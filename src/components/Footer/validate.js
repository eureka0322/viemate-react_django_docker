import memoize from 'lru-memoize';
import { createValidator, required, email } from 'utils/validation';

const validation = createValidator({
  email_address: [required, email],
});
export default memoize(10)(validation);
