import apiClient from '../apiClient';

export const subscribeToken = (token, authorizationHeader) =>
  apiClient.post(
    '/mobile-token',
    {},
    {
      headers: {
        Authorization: `Bearer ${authorizationHeader}`,
        'Content-Type': 'application/json',
      },
    },
  );

export const unsubscribeToken = (token, authorizationHeader) =>
  apiClient.delete('/mobile-token', {
    headers: {
      Authorization: `Bearer ${authorizationHeader}`,
      'Content-Type': 'application/json',
    },
    data: {token}
  });
