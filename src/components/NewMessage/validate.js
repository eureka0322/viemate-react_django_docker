
import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const messageValidation = createValidator({
  message: [required],
});
export default memoize(10)(messageValidation);
