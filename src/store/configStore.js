import ReduxThunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import productReducer from './reducer/product';
import cartReducer from './reducer/cart';
import authReducer from './reducer/auth';
import ordersReducer from './reducer/orders';
import promotionReducer from './reducer/promotion';
import notificationReduser from './reducer/natification';
import themeReducer from './reducer/local';
const persistConfig = {
  // persistConfig for store reducer state
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['carts', 'localStorage'],
};
const rootReducer = combineReducers({
  auth: authReducer,
  carts: cartReducer,
  orders: ordersReducer,
  product: productReducer,
  localStorage: themeReducer,
  promotion: promotionReducer,
  notification: notificationReduser,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
export const persiststore = persistStore(store);
