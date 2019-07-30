import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from './src/views/home/home.view';
import BuilderPage from './src/views/builder/builder.view';
import SponsorPage from './src/views/sponsor/sponsor.view';
import BrewPage from './src/views/brew/brew.view';
import WelcomePage from './src/views/welcome/welcome.view';
import TutorialPage from './src/views/tutorial/tutorial.view';

const MainStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomePage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Tutorial: {
      screen: TutorialPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Home: {
      screen: HomePage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Sponsor: {
      screen: SponsorPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    Builder: {
      screen: BuilderPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Welcome',
    mode: 'card',
  }
);
const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Brew: {
      screen: BrewPage,
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Main',
    mode: 'modal',
    cardStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      opacity: 1
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }
    })
  }
);

export default createAppContainer(AppNavigator);
