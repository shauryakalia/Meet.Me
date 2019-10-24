import axios from 'axios';
import Cookies from 'js-cookie';

// Custom Imports
import { API_URL } from '../constant';
import { func } from 'prop-types';

// Function to set token for headers
function getToken() {
  return Cookies.get('userToken');
}

// Function to request login
// function popIn(user) {
//   return axios({
//     data: {
//       email: user.email,
//       name: user.name,
//       userName: user.userName,
//       image: user.image,
//       googleId: user.googleId,
//       loginType: user.loginType,
//     },
//     method: 'POST',
//     url: `${API_URL}/popin`,
//   });
// }

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

  // popIn,
  // createPost,
  // getProfile

};