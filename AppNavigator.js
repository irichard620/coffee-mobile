import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from './src/views/home/home.view';
import BuilderPage from './src/views/builder/builder.view';
import SponsorPage from './src/views/sponsor/sponsor.view';
import BrewPage from './src/views/brew/brew.view';
import WelcomePage from './src/views/welcome/welcome.view';
import TutorialPage from './src/views/tutorial/tutorial.view';
import SettingsPage from './src/views/settings/settings.view';

const AppNavigator = createStackNavigator(
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
    Settings: {
      screen: SettingsPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    Brew: {
      screen: BrewPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Welcome',
    mode: 'card',
  }
);

export default createAppContainer(AppNavigator);
