import React from 'react'
import { Provider } from 'react-redux'
import store from './src/reducers/store'
import AppNavigator from './AppNavigator'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <AppNavigator />
      </Provider>
    );
  }
}
