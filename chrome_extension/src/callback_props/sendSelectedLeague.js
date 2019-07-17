import axios from 'axios';


export default (league) => {
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_BACKEND}/setLeague`,
    withCredentials: true,
    data: { currentLeague: league }
  });
  console.log('league sent');
}