import React, {useContext, useEffect, useReducer, useState} from 'react';
import {AsyncStorage} from 'react-native';
import Login_reducers from '../reducer/login_reducer';
import {
  CHECK_LOGIN_BEGIN,
  CHECK_LOGIN_SUCCESS,
  CHECK_LOGIN_ERROR,
  RESTORE_TOKEN,
  USER_ID,
  USER_ROLE,
  LOGOUT_USER,
  RESTORE_LOGIN,
} from '../../../Utils/action';
import {login_check_url, ACCEPT_HEADER} from '../../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const Logincontext = React.createContext();

const initialState = {
  login_loading: false,
  token: '',
  role: '',
  islogin: false,
};

export const Loginprovider = ({children}) => {
  const [state, dispatch] = useReducer(Login_reducers, initialState);
  const [refresh, setRefresh] = useState('');

  const Loginapi = async (param, props) => {
    dispatch({type: CHECK_LOGIN_BEGIN});
    console.log('formdata', param);
    axios
      .post(login_check_url, param, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      })
      .then(async res => {
        console.log('data123', res.data);
        // await AsyncStorage.setItem('login_type_param', 'role');
        AsyncStorage.setItem('token', res.data.token);
        if (res.data.success === 1) {
          AsyncStorage.setItem('role', JSON.stringify(res.data.user.role));
          AsyncStorage.setItem('user_id', JSON.stringify(res.data.user.id));
          // dispatch({type: CHECK_LOGIN_SUCCESS, payload: res.data.data});
          Toast.show(res.data.message);
          await AsyncStorage.setItem('islogin', 'yes');
          props.navigation.navigate('Home');
          dispatch({type: CHECK_LOGIN_ERROR});
          await setRefresh(1);
        } else {
          Toast.show('something went wrong');
          dispatch({type: CHECK_LOGIN_ERROR});
        }
      })
      .catch(err => {
        console.log('err', err);
        Toast.show('something wents wrong');
        dispatch({type: CHECK_LOGIN_ERROR});
      });
  };

  const setLogout = async props => {
    await dispatch({type: LOGOUT_USER});
    await props.navigation.reset({
      routes: [{name: 'Login'}],
    });
    await setRefresh(2);
  };
  useEffect(() => {
    AsyncStorage.getItem('islogin').then(value => {
      if (value) {
        dispatch({type: RESTORE_LOGIN, payload: JSON.parse(value)});
      }
    });
    AsyncStorage.getItem('token').then(value => {
      if (value) {
        // console.log("----------", value);
        dispatch({type: RESTORE_TOKEN, payload: value});
      }
    });
    AsyncStorage.getItem('user_id').then(value => {
      if (value) {
        // console.log("----------", value);
        dispatch({type: USER_ID, payload: value});
      }
    });
    AsyncStorage.getItem('role').then(value => {
      if (value) {
        console.log('----------', value);
        dispatch({type: USER_ROLE, payload: value});
      }
    });

    AsyncStorage.getItem('login_param').then(value => {
      if (value) {
        console.log('-------', value);
      }
    });
  }, [refresh]);

  return (
    <Logincontext.Provider
      value={{
        ...state,
        Loginapi,
        setLogout,
      }}>
      {children}
    </Logincontext.Provider>
  );
};

export const useLoginContext = () => {
  return useContext(Logincontext);
};
