import axios from 'axios';


export default (league) => {
  axios({
    method: 'post',
    url: 'http://lvh.me/setLeague',
    withCredentials: true,
    data: { currentLeague: league }
  });
  console.log('league sent');
}