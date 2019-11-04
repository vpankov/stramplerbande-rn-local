import axios from 'axios';
import * as store from '../store'

const _axios = axios.create({
    baseURL: 'https://www.racker-bande.de',
});

_axios.interceptors.request.use(
    async (request) => {
        if ( request.url !== '/loginapi.php') {
            const { username, password } = await store.getCredentials()
            request.data = {
                ...request.data,
                username,
                password,
            }
        }

        return request
    },
    (error) => { return Promise.reject(error); }
);

_axios.interceptors.response.use(
    (response) => { return response; },
    (error) => { Promise.reject(error) }
);

export default _axios