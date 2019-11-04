import apiClient from '../apiClient';

const validateCredentialsService = ({username, password}) => {
  return apiClient
    .post('/loginapi.php', {
      username,
      password,
      device_token: '',
    })
    .then(result => {
      if (result.data.status !== 200) {
        throw new Error('invalid credentials');
      }
    });
};

export default validateCredentialsService;
