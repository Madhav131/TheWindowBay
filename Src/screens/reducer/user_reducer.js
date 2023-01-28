import {
  USER_BEGIN,
  USER_BEGIN_SUCCESS,
  USER_BEGIN_ERROR,
} from '../../../Utils/action';

const Usergetdata = (state, action) => {
  switch (action.type) {
    case USER_BEGIN:
      return {...state, User_loading: true};

    case USER_BEGIN_SUCCESS:
      return {
        ...state,
        User_loading: false,
        User_array: action.payload,
      };

    case USER_BEGIN_ERROR:
      return {...state, User_loading: false};
  }
};

export default Usergetdata;
