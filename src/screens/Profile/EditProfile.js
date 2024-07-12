import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TransitionPresets} from '@react-navigation/stack';
import * as actionAuth from '../../store/action/auth';
import * as Animatable from 'react-native-animatable';
import Input from '../../components/UI/Input';
import {Colors as Color, PADDING_BOTTOM, cardView} from '../../constant/index';
import Cardx from '../../components/UI/Card';
import AntDesign from 'react-native-vector-icons/AntDesign';
import i18n from '../../../Translations/index';
import Text from '../../components/UI/DefaultText';
import {useTheme} from '@react-navigation/native';
import TouchableCmp from '../../components/UI/TouchableCmp';
import {
  goBack,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
/**
 * @flow
 * dispatch formstate usign useReducer
 */
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditProfile = props => {
  const [error, setError] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const theme = useTheme();
  const {colors} = theme;
  const customer_data = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  const data = customer_data[0];
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: data ? data.name : '',
      email: data ? data.email : '',
      phone: data ? data.mobile : '',
    },
    inputValidities: {
      name: data ? true : false,
      email: data ? true : false,
      phone: data ? true : false,
    },
    formIsValid: data ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    _onLoading();
    setError(null);
    try {
      const {name, email, phone} = formState.inputValues;
      await dispatch(actionAuth.updateCustomerProfile(name, email, phone));
      await dispatch(actionAuth.getUserInfo(customer_data[0]['uid']));
      goBack();
      _onLoadingFinish();
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, formState.formIsValid, formState.inputValues, customer_data]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputValue);
      console.log(inputValidity);
      console.log(inputIdentifier);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );
  const handleEditing = () => {
    setIsEdit(!isEdit);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <React.Fragment>
      <ScrollView>
        <View
          style={{
            ...cardView,
            backgroundColor: colors.background,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <View style={styles.form}>
            <View style={{...styles.formHeader}}>
              <Text style={{...styles.formHeaderTitle}}>
                {i18n.t('editprofile.Contact info')}
              </Text>
              <TouchableCmp onPress={handleEditing}>
                <View>
                  {!isEdit ? (
                    <Text
                      style={{
                        ...styles.formHeaderTitle,
                        fontSize: 12,
                        textTransform: 'uppercase',
                      }}>
                      {i18n.t('editprofile.Edit')}
                    </Text>
                  ) : (
                    <AntDesign name="close" size={24} color="red" />
                  )}
                </View>
              </TouchableCmp>
            </View>
            {!isEdit ? (
              <View>
                {!!data.name && <Text style={styles.text}>{data.name}</Text>}
                {!!data.email && <Text style={styles.text}>{data.email}</Text>}
                {!!data.mobile && (
                  <Text style={styles.text}>{data.mobile}</Text>
                )}
              </View>
            ) : (
              <Animatable.View>
                <Input
                  id="name"
                  autoFocus={data.name === null ? true : false}
                  label={i18n.t('editprofile.Name')}
                  errorText="Please enter a valid name!"
                  keyboardType="default"
                  autoCapitalize="sentences"
                  autoCorrect
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue={data ? data.name : ''}
                  initiallyValid={!!data.name}
                  required
                  minLength={3}
                  maxLength={50}
                />
                <Input
                  id="email"
                  autoFocus={data.email === null ? true : false}
                  label={i18n.t('editprofile.Email')}
                  email
                  autoCapitalize="none"
                  errorText="Please enter a valid email!"
                  keyboardType="email-address"
                  onInputChange={inputChangeHandler}
                  initialValue={data ? data.email : ''}
                  initiallyValid={!!data.email}
                  required
                />
                <Input
                  id="phone"
                  autoFocus={data.mobile === null ? true : false}
                  label={i18n.t('editprofile.Phone')}
                  phone
                  errorText="Please enter a valid number!"
                  keyboardType="number-pad"
                  autoCorrect
                  returnKeyType="next"
                  multiline
                  numberOfLines={1}
                  onInputChange={inputChangeHandler}
                  initialValue={data ? data.mobile : ''}
                  initiallyValid={!!data.mobile}
                  required
                  minLength={9}
                  maxLength={13}
                />
              </Animatable.View>
            )}
          </View>
        </View>
      </ScrollView>
      {!isKeyboardVisible ? (
        isEdit && (
          <Cardx style={{...styles.footer, backgroundColor: colors.background}}>
            <TouchableCmp onPress={submitHandler}>
              <Animatable.View
                animation="fadeInUpBig"
                duration={250}
                style={{alignItems: 'center'}}>
                <View
                  style={{
                    ...styles.content,
                    backgroundColor: theme.dark ? Color.primary : Color.primary,
                  }}>
                  <Text style={styles.textSave}>
                    {i18n.t('editprofile.Save change')}
                  </Text>
                </View>
              </Animatable.View>
            </TouchableCmp>
          </Cardx>
        )
      ) : (
        <View></View>
      )}
    </React.Fragment>
  );
};

export default EditProfile;
export const screenOptions = navData => {
  const TransitionPreset =
    Platform.OS === 'ios'
      ? TransitionPresets.DefaultTransition
      : TransitionPresets.FadeFromBottomAndroid;
  return {
    headerTitle: i18n.t('editprofile.Edit Profile'),
    ...TransitionPreset,
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formHeaderTitle: {
    fontSize: 16,
    paddingBottom: 5,
    fontFamily: 'OpenSans-Bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    borderRadius: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? PADDING_BOTTOM : 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 250,
  },
  textSave: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
  text: {
    marginVertical: 2.5,
    fontFamily: 'OpenSans-Regular',
  },
});
