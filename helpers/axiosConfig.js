import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://3022-149-143-60-69.ngrok.io/api'
});

export default instance;