import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const idValidation = createValidator({
  attachment: [required]
});
export default memoize(10)(idValidation);
