import axios from 'axios';

// export const apiURL = 'https://safe-to-connect.com:8091/api';
// export const apiURL = 'https://stramplerbande.org:8091/api';
export const apiURL = 'http://sbtest.theleanapps.com:8091/api';
// export const apiURL = 'http://sbdemo.theleanapps.com:8091/api';

const _axios = axios.create({
  baseURL: apiURL,
});

export default _axios;
