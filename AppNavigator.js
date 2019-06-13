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
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomePage,
    },
    Builder: {
      screen: BuilderPage,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: "Home",
    mode: 'modal'
  }
);

export default createAppContainer(AppNavigator);
