/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import HomePage from './src/views/home/home.view';
import BuilderPage from './src/views/builder/builder.view';
import SponsorPage from './src/views/sponsor/sponsor.view';
import BrewPage from './src/views/brew/brew.view';
import { createStackNavigator, createAppContainer } from "react-navigation";

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomePage,
    },
    Sponsor: {
      screen: SponsorPage,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: "Home",
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
    initialRouteName: "Main",
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
