import memoize from 'lru-memoize';
import { createValidator, required, email, minLength } from 'utils/validation'; // eslint-disable-line

const profileValidation = createValidator({
  first_name: [required],
  last_name: [required],
  profile_attributes: createValidator({
    // age: [required],
    // hometown: [required],
    // gender: [required],
    // university: [required],
    about: [minLength(15)],
  })
});
export default memoize(10)(profileValidation);
