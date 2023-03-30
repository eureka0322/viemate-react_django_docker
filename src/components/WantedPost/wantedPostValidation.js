import memoize from 'lru-memoize';
import { createValidator, required, integer, dateRange, multipleValidation } from 'utils/validation';

const PostFormValidation = createValidator({
  dates_range: [dateRange],
  price: [required, integer],
  address: [required],
  lease_type_temporary: [multipleValidation(['lease_type_temporary', 'lease_type_take_over'])],
  lease_type_take_over: [multipleValidation(['lease_type_temporary', 'lease_type_take_over'])],
  place_type: [required],
});
export default memoize(10)(PostFormValidation);
