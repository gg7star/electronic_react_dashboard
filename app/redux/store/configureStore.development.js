import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import rootReducer from './../modules';
import * as accountUIActions from './../modules/accountUI';
import * as accountUsersActions from './../modules/accountUsers';
import * as activitiesActions from './../modules/activities';
import * as cartActions from './../modules/cart';
import * as cashierActions from './../modules/cashier';
import * as inventoryItemsActions from './../modules/inventoryItems';
import * as inventoryUIActions from './../modules/inventoryUI';
import * as loginActions from './../modules/login';

firebase.initializeApp({
  apiKey: 'AIzaSyAfQL_veurKkeW3Tbfzn7WCWXJtbycBq68',
  authDomain: 'vivid-torch-4276.firebaseapp.com',
  databaseURL: 'https://vivid-torch-4276.firebaseio.com',
  storageBucket: 'vivid-torch-4276.appspot.com',
});

const firebaseAPI = {
  ref: firebase.database().ref(),
  storage: firebase.storage().ref(),
  auth: firebase.auth(),
  timestamp: firebase.database.ServerValue.TIMESTAMP,
};

const actionCreators = {
  accountUIActions,
  accountUsersActions,
  activitiesActions,
  cartActions,
  cashierActions,
  inventoryUIActions,
  inventoryItemsActions,
  loginActions,
  push,
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const router = routerMiddleware(hashHistory);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
    actionCreators,
  }) :
  compose;
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument(firebaseAPI), router, logger)
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('./../modules', () =>
      store.replaceReducer(require('./../modules')) // eslint-disable-line global-require
    );
  }

  return store;
}
