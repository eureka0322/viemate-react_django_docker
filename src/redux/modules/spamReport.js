import config from 'config';
import { showNotification } from './notifications';

const REPORT = 'spam/REPORT';
const REPORT_SUCCESS = 'spam/REPORT_SUCCESS';
const REPORT_FAIL = 'spam/REPORT_FAIL';

const initialState = {
  reporting: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REPORT:
      return { ...state, reporting: true };
    case REPORT_SUCCESS:
      return { ...state, reporting: false };
    case REPORT_FAIL:
      return { ...state, reporting: false };
    default:
      return state;
  }
}

export function reportSpam(id, data) {
  return (dispatch) => {
    return dispatch({
      types: [REPORT, REPORT_SUCCESS, REPORT_FAIL],
      promise: (client) => client.post(`${config.apiPrefix}/posts/${id}/spam_reports`, {data}).then(r => {
        dispatch(showNotification('spma_report', {text: 'Your report has been sent', type: 'success'}));
        return Promise.resolve(r);
      }, err => {
        if (err.body && err.body.errors && err.body.errors.user_id) {
          dispatch(showNotification('spam_report_err', {text: err.body.errors.user_id[0], type: 'error'}));
        }
        return Promise.reject(err);
      })
    });
  };
}
