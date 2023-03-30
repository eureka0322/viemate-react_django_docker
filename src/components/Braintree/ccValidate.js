import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation'; // eslint-disable-line

const ccValidate = createValidator({
  first_name: [required],
  last_name: [required],
});
export default memoize(10)(ccValidate);
