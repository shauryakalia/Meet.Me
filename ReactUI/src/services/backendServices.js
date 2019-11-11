import axios from 'axios';

// Custom Imports
import Constant from '../constant';

function getToken() {
  let token = localStorage.getItem('token');
  return token;
}

// Function to request login
function registerPractice(user) {
  return axios({
    data: user,
    method: 'POST',
    url: `${Constant.API_URL}/registerPractice`,
  });
}

function login(user) {
  return axios({
    data: user,
    method: 'POST',
    url: `${Constant.API_URL}/login`,
  });
}

function getPrices(practiceId) {
  return axios({
    method: 'GET',
    url: `${Constant.API_URL}/getPrices/${practiceId}`,
  });
}

function registerPrice(data) {
  return axios({
    data: {
      service: data.service,
      price: data.price
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/registerPrices`,
  });
}

function updatePrice(data) {
  return axios({
    data: {
      priceId: data.priceId,
      service: data.service,
      price: data.price
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/updatePrice`,
  });
}

export default {

  registerPractice,
  login,
  getPrices,
  registerPrice,
  updatePrice,
  // getProfile

};