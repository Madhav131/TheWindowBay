import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Usergetdata} from '../../screens/reducer/user_reducer';
import axios from 'axios';
import {
  USER_BEGIN,
  USER_BEGIN_SUCCESS,
  USER_BEGIN_ERROR,
} from '../../../Utils/action';
import {useLoginContext} from './login_context';

import {User_api, ACCEPT_HEADER} from '../../../Utils/baseurl';

const UserContext = React.useContext();

const initialState = {
  User_loading: false,
  User_array: [],
};

export const GetuserProvider = ({children}) => {
  const {token} = useLoginContext();
  const [state, dispatch] = useReducer(Usergetdata, initialState);
  const GetUserData = async () => {
    dispatch({type: USER_BEGIN});
    await axios
      .get(User_api, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        console.log('User_api', res.data);
        dispatch({
          type: USER_BEGIN_SUCCESS,
          payload: res.data,
        }).catch(err => {
          dispatch({type: USER_BEGIN_ERROR});
          console.log(err);
        });
      });
  };
  return (
    <UserContext.Provider
      value={{
        ...state,
        GetUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
