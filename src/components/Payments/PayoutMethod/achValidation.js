import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const achValidation = createValidator({
  name: [required],
  account_type: [required],
  routing_number: [required],
  account_number: [required],
});
export default memoize(10)(achValidation);
