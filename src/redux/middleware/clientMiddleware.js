export default function clientMiddleware(client) {
  return ({ dispatch, getState }) =>
    next => (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const multi_next = ({type, ...params}) => {
        if (typeof type === 'object' && Array.isArray(type)) {
          type.forEach((c) => next({type: c, ...params}));
        } else {
          next({type, ...params});
        }
      };

      const [REQUEST, SUCCESS, FAILURE] = types;
      multi_next({ ...rest, type: REQUEST });

      const actionPromise = promise(client);
      actionPromise.then(
        result => multi_next({ ...rest, result, type: SUCCESS }),
        error => {
          if (error.status === 401) {
            multi_next({ ...rest, error: error.body, type: [FAILURE, 'auth/LOAD_FAIL'] });
          } else {
            multi_next({ ...rest, error: error.body, type: FAILURE });
          }
        }
      ).catch((error) => {
        console.error('MIDDLEWARE ERROR:', error);
        multi_next({ ...rest, error: error.body, type: FAILURE });
      });
      return actionPromise;
    };
}
