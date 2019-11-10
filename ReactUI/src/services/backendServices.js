import axios from 'axios';

// Custom Imports
import Constant from '../constant';

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

// //Function to create Post
// function createPost(user) {
//     return axios({
//         headers: {
//             'x-access-token': getToken(),
//             contentType: 'application/x-www-form-urlencoded',
//         },
//         data: {
//             email: user.email,
//             id: user.id,

//         },
//         method: 'POST',
//         url: `${API_URL}/user/post`,
//     });
// }
// function getProfile(userid){
//   return axios({
//     headers: {
//         'x-access-token': getToken(),
//         contentType: 'application/x-www-form-urlencoded',
//     },
//     method: 'GET',
//     url: `${API_URL}/user/${userid}/profile`,
// });
// }

export default {

  registerPractice,
  login,
  // getProfile

};