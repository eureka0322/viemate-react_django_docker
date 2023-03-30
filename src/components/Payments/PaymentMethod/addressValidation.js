import memoize from 'lru-memoize';
import { createValidator, required, minLength, maxLength } from 'utils/validation';

const addressValidation = createValidator({
  country_name: [required],
  street_address: [required, minLength(5)],
  postal_code: [required, minLength(3), maxLength(9)],
  locality: [required]
});
export default memoize(10)(addressValidation);
