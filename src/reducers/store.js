import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import sponsorsReducer from './sponsor-reducers';
import recipesReducer from './recipe-reducers';
import userReducer from './user-reducers';
import vesselsReducer from './vessel-reducers';
import locationsReducer from './location-reducers';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
  sponsorsReducer,
  recipesReducer,
  userReducer,
  vesselsReducer,
  locationsReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

export default store;
