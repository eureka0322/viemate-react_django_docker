import memoize from 'lru-memoize';
import { createValidator, required, namePlace, mapDropDown, integer, dateRange, multipleValidation, minLength } from 'utils/validation';

const PostFormValidation = createValidator({
  title: [namePlace],
  price: [required, integer],
  dates_range: [dateRange],
  lease_type_temporary: [multipleValidation(['lease_type_new', 'lease_type_temporary', 'lease_type_take_over'])],
  lease_type_take_over: [multipleValidation(['lease_type_new', 'lease_type_temporary', 'lease_type_take_over'])],
  lease_type_new: [multipleValidation(['lease_type_new', 'lease_type_temporary', 'lease_type_take_over'])],
  street_name: [required],
  coordinates: [mapDropDown],
  zip_code: [required, minLength(3)],
  place_type: [required],
  photo: [required]
});
export default memoize(10)(PostFormValidation);
