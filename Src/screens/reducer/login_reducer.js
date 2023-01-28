import {State} from 'react-native-gesture-handler';
import {AsyncStorage} from 'react-native';

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

const Login_reducers = (state, action) => {
  switch (action.type) {
    case CHECK_LOGIN_BEGIN:
      return {...state, login_loading: true};

    case CHECK_LOGIN_ERROR:
      return {...state, login_loading: false};

    case CHECK_LOGIN_SUCCESS:
      return {
        ...state,
        login_loading: false,
        Podcasts_array: action.payload,
        // token: action.payload.token,
        isLogin: true,
        user_id: action.payload.user_id,
      };

    case CHECK_LOGIN_ERROR:
      return {...state, login_loading: false};

    case RESTORE_LOGIN:
      return {...state, isLogin: action.payload};

    case RESTORE_TOKEN:
      return {...state, token: action.payload.token};
    case USER_ID:
      return {...state, user_id: action.payload.token};
    case USER_ROLE:
      return {...state, role: action.payload};
    case LOGOUT_USER:
      AsyncStorage.clear();
      return {
        ...state,
        role: '',
        isLogin: false,
      };
    default:
      return {...state};
  }
};

export default Login_reducers;
