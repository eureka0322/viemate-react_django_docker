import memoize from 'lru-memoize';
import { createValidator/*, requiredOneOf*/, required } from 'utils/validation';

const reportValidation = createValidator({
  // asked_money: [requiredOneOf(['is_spam'])],
  body: [required],
});
export default memoize(10)(reportValidation);

