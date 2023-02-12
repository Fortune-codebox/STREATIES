// import ENV from '../env';
import CryptoJS from 'crypto-js';



/*to get user token*/
export const getToken = () => {
    return window.localStorage.getItem('tok1xl');
};

/*to register the token*/
export const saveToken = token => {
    window.localStorage.setItem('tok1xl', token);
};

/*save user data*/
export const saveUserData = (userData) => {
    userData = JSON.stringify(userData);
    /*re-encrypt the user information in KMUS with KMUS application key*/
    const encryptedUserData = CryptoJS.AES.encrypt(userData, 'tok1xl');
    window.localStorage.setItem('usr-1xl', encryptedUserData);
};


export const getUserData = () => {
    const userData = window.localStorage.getItem('usr-1xl');
    if(userData) {
      const bytes = CryptoJS.AES.decrypt(userData.toString(), 'tok1xl');
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  };

  export const logoutUser = () => {
    window.localStorage.removeItem('usr-1xl');
    destroyToken();
  };
  /*destroying the token function*/
  export const destroyToken = () => {
    window.localStorage.removeItem('tok1xl');
  };
