import { cookies } from 'next/headers';

const makePost = (url: string, body: string, options: object) => {
  const headers = options.headers || {};
  return fetch(url, {
    body,
    headers,
    method: 'POST',
  }).then((res) => {
    if (res.statusText === 'No Content') {
      return res;
    }
    return res.json();
  });
};

const makeJSONPost = (url: string, data: any, options: { headers: {} }) => {
  const body = JSON.stringify(data);
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';

  return makePost(url, body, { headers });
};

export const getAuth0Token = async () => {
  const url = `https://dev-3rdz760m2026mipo.us.auth0.com/oauth/token`;

  const options = {
    method: 'POST',
    headers: {
      cookie: '',
      'Content-Type': 'application/json',
    },
    body: '{"client_id": "IWk1RCO8mCgO0I4E96CJt3b9Tx5uT0QD","client_secret":"EDR9FB0w2HdBd436Yzu-I4eqmxRdRTySTnPYwgKfAdX-l2gEnibHskND3_uDFpM-","audience":"https://dev-3rdz760m2026mipo.us.auth0.com/api/v2/",      "grant_type":"client_credentials"}',
  };

  const res = fetch(url, options).then((response) => response.json());
  return res;
};

export const createAuth0User = async (
  data: any,
  token: any,
  tokenType: any
) => {
  const url = `https://dev-3rdz760m2026mipo.us.auth0.com/api/v2/users`;
  const headers = {
    Authorization: `${tokenType} ${token}`,
  };
  const body = data;
  return makeJSONPost(url, body, { headers });
};
export const createUser = (data: any) => {
  const url = `/api/auth0`;
  const body = { data };
  return makeJSONPost(url, body, { headers: {} });
};
