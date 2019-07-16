import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from './src/views/home/home.view';
import BuilderPage from './src/views/builder/builder.view';
import SponsorPage from './src/views/sponsor/sponsor.view';
import BrewPage from './src/views/brew/brew.view';
import WelcomePage from './src/views/welcome/welcome.view';
import TutorialPage from './src/views/tutorial/tutorial.view';

const fade = (props) => {
  const { position, scene } = props;
  const { index } = scene;

  const translateX = 0;
  const translateY = 0;

  const opacity = position.interpolate({
    inputRange: [index - 0.7, index, index + 0.7],
    outputRange: [0.3, 1, 0.3]
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }]
  };
};

const MainStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomePage,
    },
    Tutorial: {
      screen: TutorialPage,
    },
    Home: {
      screen: HomePage,
    },
    Sponsor: {
      screen: SponsorPage,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    transitionSpec: {
      duration: 100,
    },
    transitionConfig: () => ({
      screenInterpolator: (props) => { fade(props); }
    })
  }
);
const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Builder: {
      screen: BuilderPage,
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
      backgroundColor: 'rgba(0, 0, 0, 0)',
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
