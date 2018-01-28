import * as api from './api';

export default () => {
  return true;
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
