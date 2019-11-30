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

function getPracticeDetails(practiceId) {
  return axios({
    method: 'GET',
    url: `${Constant.API_URL}/getPracticeDetails/${practiceId}`,
  });
}

function getCalendarSlots(data) {
  return axios({
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'GET',
    url: `${Constant.API_URL}/practice/${data.practiceId}/getCalendarSlots/service/${data.serviceId}`,
  });
}

function getCalendarBookings(data) {
  return axios({
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'GET',
    url: `${Constant.API_URL}/practice/${data.practiceId}/getCalendarBookings/service/${data.serviceId}`,
  });
}

function getBookings(data) {
  return axios({
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'GET',
    url: `${Constant.API_URL}/practice/${data.practiceId}/getBookingHistory/service/${data.serviceId}`,
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

function deletePrice(data) {
  return axios({
    data: {
      priceId: data.priceId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/deletePrice`,
  });
}

function getServices(practiceId) {
  return axios({
    method: 'GET',
    url: `${Constant.API_URL}/getServices/${practiceId}`,
  });
}

function registerService(data) {
  return axios({
    data: {
      serviceName: data.serviceName,
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/registerServices`,
  });
}

function updateService(data) {
  return axios({
    data: {
      serviceId: data.serviceId,
      serviceName: data.serviceName
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/updateService`,
  });
}

function deleteService(data) {
  return axios({
    data: {
      serviceId: data.serviceId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/deleteService`,
  });
}

function getTimings(practiceId) {
  return axios({
    method: 'GET',
    url: `${Constant.API_URL}/getTimings/${practiceId}`,
  });
}

function registerTiming(data) {
  return axios({
    data: {
      day: data.day,
      from: data.from,
      to: data.to,
      closed: data.closed
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/registerTimings`,
  });
}

function updateTiming(data) {
  return axios({
    data: {
      timingId: data.timingId,
      from: data.from,
      to: data.to,
      closed: data.closed
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/updateTiming`,
  });
}

function deleteTiming(data) {
  return axios({
    data: {
      timingId: data.timingId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/deleteTiming`,
  });
}

function addSlot(data) {
  return axios({
    data: {
      fromTime: data.fromTime,
      serviceId: data.serviceId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/addSlot`,
  });
}

function deleteSlot(data) {
  return axios({
    data: {
      fromTime: data.fromTime,
      slotId: data.slotId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/deleteSlot`,
  });
}

function addBooking(data) {
  return axios({
    data: data,
    headers: {
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/booking`,
  });
}

function cancelBooking(data) {
  return axios({
    data: {
      slotId: data.slotId,
      bookingId: data.bookingId
    },
    headers: {
      'x-access-token': getToken(),
      contentType: 'application/json',
    },
    method: 'POST',
    url: `${Constant.API_URL}/practice/${data.practiceId}/cancelBooking`,
  });
}

export default {

  registerPractice,
  login,
  getPracticeDetails,
  getCalendarSlots,
  getCalendarBookings,
  getBookings,
  getPrices,
  registerPrice,
  updatePrice,
  deletePrice,
  getServices,
  registerService,
  updateService,
  deleteService,
  getTimings,
  registerTiming,
  updateTiming,
  deleteTiming,
  addSlot,
  deleteSlot,
  addBooking,
  cancelBooking,
};