import { RESTAURANT_LOGIN_FAIL, RESTAURANT_LOGIN_REQUEST, RESTAURANT_LOGIN_SUCCESS } from '../constants.js';

export const restaurantLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case RESTAURANT_LOGIN_REQUEST:
      return { loading: true };
    case RESTAURANT_LOGIN_SUCCESS:
      return { loading: false, info: action.payload };
    case RESTAURANT_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
