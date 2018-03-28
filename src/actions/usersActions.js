import Axios from 'axios';
const HOST = '/api/users'; 

export const LOAD_SINGLE_USER = `LOAD_SINGLE_USER`;

export const loadSingleUser = id => {
  return dispatch => {
    return Axios.get(`${HOST}/${id}`)
    .then(user => {
      dispatch({
        type: LOAD_SINGLE_USER,
        user: user.data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }
}