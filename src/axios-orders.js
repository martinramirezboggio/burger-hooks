import axios from 'axios';

const instance = axios.create({
  baseURL:'https://burger-7427e.firebaseio.com/'
});

export default instance;