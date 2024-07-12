import {typeTheme} from '../../constant/index';

const initailState = {
  isDarkTheme: false,
  code: null,
};

export default (state = initailState, action) => {
  switch (action.type) {
    case typeTheme.SET_TOGGLE_THEME:
      return {
        ...state,
        isDarkTheme: action.payload,
      };
    case typeTheme.SET_TOGGLE_CHANGE_LANGUAGE:
      return {
        ...state,
        code: action.payload,
      };
    default:
      return state;
  }
};
