import cookie from 'cookie';
import * as api from './api';

export default context => {
  api
    .call('auth/self', 'GET', '', context)
    .then(data => {
      return data.json();
    })
    .then(json => {
      if (json.user) {
        return json;
      }
    })
    .catch(() => {
      // Fail gracefully
      return null;
    });
};
