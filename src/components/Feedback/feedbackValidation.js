import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const profileValidation = createValidator({
  question1: [required]
});
export default memoize(10)(profileValidation);
