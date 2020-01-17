import apiClient from '../apiClient';

const configurePushService = ({token, oldToken = '', status}) => {
  if (!token) {
    return Promise.reject(new Error('PUSH: device token is empty'));
  }
  console.log('token', token)

  const payload = {
    device_token: token,
    old_device_token: oldToken,
    status: status ? 1 : 0,
  };

  return apiClient.post('/pSubscription.php', payload).then(result => {
    return result;
  });
};

export default configurePushService;
