
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, Dimensions, StyleSheet, Image, TouchableOpacity,
  TextInput, LayoutAnimation, Alert, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';

import { fetchDefaultRecipes } from '../../actions/recipe-actions';
import { saveUsername, fetchUser } from '../../actions/user-actions';
import { fetchSponsors } from '../../actions/sponsor-actions';
import * as constants from '../../constants';
import FastImage from 'react-native-fast-image';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: -1,
      name: '',
    };
  }

  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  componentWillReceiveProps(nextProps) {
    const {
      user, recipes, sponsors, navigation, getDefaultRecipes, getSponsors, isFocused
    } = this.props;
    const { step } = this.state;

    if (!isFocused) {
      return;
    }

    const nextUser = nextProps.user;
    const nextRecipes = nextProps.recipes;
    const nextSponsors = nextProps.sponsors;

    if (user && user.userIsFetching && !nextUser.userIsFetching) {
      // If finished fetching, check if we should go to welcome page
      if (Object.keys(nextUser.user).length === 0 || nextUser.user.name === '') {
        // Go to welcome page
        LayoutAnimation.configureNext(constants.CustomLayoutSpring);
        this.setState({
          step: 0
        });
      } else {
        // Do default recipes if user there
        getDefaultRecipes();
      }
    } else if (user && user.userIsSaving && !nextUser.userIsSaving) {
      // If finished saving, save default recipes
      getDefaultRecipes();
    } else if (recipes && recipes.recipesIsFetching && !nextRecipes.recipesIsFetching) {
      if (nextRecipes.error !== '') {
        // Show alert
        Alert.alert(
          'Error occurred',
          `Could not fetch new recipes from server. Error: ${nextRecipes.error}`,
          [
            {
              text: 'OK',
              onPress: () => {
                getSponsors();
              }
            },
          ],
        );
      } else {
        getSponsors();
      }
    } else if (sponsors && sponsors.sponsorsIsFetching && !nextSponsors.sponsorsIsFetching) {
      if (nextSponsors.error !== '') {
        // Show alert
        Alert.alert(
          'Error occurred',
          `Could not fetch sponsors from server. Error: ${nextSponsors.error}`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (step === 2) {
                  // Go to tutorial - we were in welcome
                  navigation.navigate('Tutorial');
                } else {
                  // Go to home - means user there
                  navigation.navigate('Home');
                }
              }
            },
          ],
        );
      } else {
        // Preload images
        let preloadList = [];
        for (let i = 0; i < sponsors.sponsors.length; i++) {
          preloadList.push({
            uri: sponsors.sponsors[i].imageLink
          });
        }
        FastImage.preload(preloadList);

        if (step === 2) {
          // Go to tutorial - we were in welcome
          navigation.navigate('Tutorial');
        } else {
          // Go to home - means user there
          navigation.navigate('Home');
        }
      }
    }
  }

  onNextClick = () => {
    const { navigation, persistUsername } = this.props;
    const { step, name } = this.state;

    if (step === 0) {
      this.setState({
        step: 1
      });
    } else if (step === 1) {
      persistUsername(name);
      this.setState({
        step: 2
      });
    } else {
      navigation.goBack();
    }
  }

  onChangeText = (text) => {
    this.setState({
      name: text
    });
  }

  render() {
    const { step, name } = this.state;

    const basePath = '../../assets/splash/';
    const baseButtonPath = '../../assets/buttons/';

    const { height } = Dimensions.get('window');
    let multiplier = 0.16;
    if (step === -1) {
      multiplier = 0.35;
    }
    const imageContainerMargin = {
      marginTop: height * multiplier
    };

    let title = '';
    if (step === 0) {
      title = 'Welcome to Drippy!';
    } else if (step === 1) {
      title = "What's your first name?";
    } else if (step === 2) {
      title = "Great! Let's get brewing...";
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Image style={[styles.logo, imageContainerMargin]} source={require(`${basePath}Splash_Logo.png`)} />
          {step !== -1 && <Text style={styles.title}>{title}</Text>}
          {step === 1 && (
          <TextInput
            onChangeText={text => this.onChangeText(text)}
            value={name}
            placeholder="First Name"
            placeholderTextColor="#b7b3b3"
            style={styles.textinput}
          />
          )}
          <View style={styles.buttonview}>
            {(step === 0 || step === 1)
                && (
                  <TouchableOpacity onPress={this.onNextClick}>
                    <Image style={[styles.mini]} source={require(`${baseButtonPath}Go.png`)} />
                  </TouchableOpacity>
                )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    alignItems: 'center'
  },
  buttonview: {
    position: 'absolute',
    top: '80%',
    width: 40,
  },
  logo: {
    height: '18%',
    resizeMode: 'contain',
    marginBottom: 50
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1D5E9E',
    marginBottom: 15
  },
  textinput: {
    alignSelf: 'flex-start',
    width: '90%',
    marginLeft: '5%',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#F1F1F1'
  },
  mini: {
    height: 40,
    width: 40
  }
});

const mapStateToProps = state => ({
  user: state.userReducer.user,
  recipes: state.recipesReducer.recipes,
  sponsors: state.sponsorsReducer.sponsors
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  getUser: fetchUser,
  persistUsername: saveUsername,
  getDefaultRecipes: fetchDefaultRecipes
};

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(WelcomePage));
