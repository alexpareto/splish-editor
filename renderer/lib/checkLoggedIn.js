import * as api from './api';

export default () => {
  return api
    .call('auth/self', 'GET')
    .then(data => {
      if (!data.ok) {
        return null;
      }
      return data.json();
    })
    .catch(() => {
      return null;
    });
};
