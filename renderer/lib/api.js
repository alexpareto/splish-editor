/* api helper library */
export const call = (endpoint, method, body = null, context = {}) => {
  const token = window.localStorage.getItem('token');
  let headers = {
    ContentType: 'multipart/form-data',
  };
  if (token && endpoint !== 'auth/login' && endpoint !== 'auth/sign-up') {
    headers = {
      ...headers,
      Authorization: 'Token ' + token,
    };
  }

  const options = {
    method: method,
    headers: headers,
    body: body,
    credentials: 'include',
  };

  return fetch('http://dev-api.splish.io/api/0.1/' + endpoint, options);
};
