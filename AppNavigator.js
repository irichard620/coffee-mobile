import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from './src/views/home/home.view';
import BuilderPage from './src/views/builder/builder.view';
import SponsorPage from './src/views/sponsor/sponsor.view';
import BrewPage from './src/views/brew/brew.view';
import WelcomePage from './src/views/welcome/welcome.view';
import TutorialPage from './src/views/tutorial/tutorial.view';
import SettingsPage from './src/views/settings/settings.view';
import DefaultRecipesPage from './src/views/settings/default-recipes.view';
import TemperaturePage from './src/views/settings/temperature.view';
import MapPage from './src/views/map/map.view';

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
    SponsorMap: {
      screen: MapPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Welcome',
    mode: 'card',
  }
);

const SettingsStack = createStackNavigator(
  {
    Home: {
      screen: SettingsPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    DefaultRecipes: {
      screen: DefaultRecipesPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    Temperature: {
      screen: TemperaturePage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    TutorialFromSettings: {
      screen: TutorialPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    mode: 'card',
  }
);

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Builder: {
      screen: BuilderPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Brew: {
      screen: BrewPage,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    Settings: {
      screen: SettingsStack,
    },
    DrippyMap: {
      screen: MapPage,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Main',
    mode: 'modal',
  }
);

export default createAppContainer(AppNavigator);
