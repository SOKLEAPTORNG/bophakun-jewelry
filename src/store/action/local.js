import {typeTheme} from '../../constant/index';
/**
 *
 * @param {*} value
 * custom toggle dark theme
 */
const setThemeSuccess = (value) => {
  return {
    type: typeTheme.SET_TOGGLE_THEME,
    payload: value,
  };
};
export const setToggleThemes = (value) => {
  return (dispatch) => {
    dispatch(setThemeSuccess(value));
  };
};

/**
 * toggle change language
 */
const setLanguageSuccess = (value) => {
  return {
    type: typeTheme.SET_TOGGLE_CHANGE_LANGUAGE,
    payload: value,
  };
};
export const setToggleLanguage = (code) => {
  return (dispatch) => {
    dispatch(setLanguageSuccess(code));
  };
};
