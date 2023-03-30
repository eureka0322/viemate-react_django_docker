
import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const phoneValidation = createValidator({
  phone: [required],
  country: [required],
  code: [required]
});
export default memoize(10)(phoneValidation);
