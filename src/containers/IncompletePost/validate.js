import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation'; // eslint-disable-line

const validate = createValidator({
  lat: [required],
  lng: [required],
  address: [required],
});
export default memoize(10)(validate);
