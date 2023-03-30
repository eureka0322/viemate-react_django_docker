
import memoize from 'lru-memoize';
import { createValidator, minLength } from 'utils/validation';

const validate = createValidator({
  message: [minLength(10)],
});
export default memoize(10)(validate);
