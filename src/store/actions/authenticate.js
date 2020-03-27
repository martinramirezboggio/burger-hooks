import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authSuccess = (idToken, userId) => {
  console.log("[authSuccess] ===> userId", userId);
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId
  }
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = expirationtime => {
  return dispatch => {
    setTimeout(() => {
        dispatch(logout());
    }, expirationtime * 1000);
  }
}

export const auth = ( email , password, isSignUp ) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPGCSOvX-j5R0yUE0wWUr55Jj7vKspC_8';
    if(!isSignUp)
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPGCSOvX-j5R0yUE0wWUr55Jj7vKspC_8';
    axios.post(url, authData)
      .then(response => {
        console.log(response);
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(+response.data.expiresIn));
      })
      .catch( error => {
        console.log(error);
        dispatch(authFail(error.response.data.error));
      })
  }
};

const getUserData = (token) => {
  const url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDPGCSOvX-j5R0yUE0wWUr55Jj7vKspC_8';
  let userId = '';
  axios.post(url,{idToken: token})
    .then(response => {
      userId = response.data.users[0].localId;
    })
    .catch(error => {
      console.log("[get User data error] =>",error);
    })
  return userId;
}

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
};

export const authCheckstate = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if(!token){
      dispatch(logout());
    } else {
      const expirationDate = new Date (localStorage.getItem('expirationDate'));
      if(expirationDate <= new Date()) {
        dispatch(logout());
      }else {
        const userId = getUserData(token);
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000) ) ;
      }
    }
  }
}
