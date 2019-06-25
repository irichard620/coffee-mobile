import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import sponsorsReducer from './sponsor-reducers'
import recipesReducer from './recipe-reducers'

const loggerMiddleware = createLogger()

const rootReducer = combineReducers({
  sponsorsReducer,
  recipesReducer
})

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

export default store
