
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Dimensions, StyleSheet, Image,
  Alert, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import { fetchDefaultRecipes } from '../../actions/recipe-actions';
import { saveUsername, fetchUser } from '../../actions/user-actions';
import { fetchSponsors } from '../../actions/sponsor-actions';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: -1,
      userIsFetching: true,
      isFirstTime: false
    };
  }

  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { userIsFetching } = prevState;
    const { user, getDefaultRecipes, persistUsername } = nextProps;

    if (user && userIsFetching && !user.userIsFetching) {
      // If finished fetching, check if we should go to welcome page
      if (Object.keys(user.user).length === 0 || user.user.name === '') {
        // Go to welcome page
        persistUsername('test', true);
        return {
          userIsFetching: false,
          isFirstTime: true
        };
      }
      // Do default recipes if user there
      getDefaultRecipes(false);
      return {
        userIsFetching: false
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      user, recipes, sponsors, getDefaultRecipes, getSponsors,
      isFocused
    } = this.props;

    if (!isFocused) {
      return;
    }

    const prevUser = prevProps.user;
    const prevRecipes = prevProps.recipes;
    const prevSponsors = prevProps.sponsors;

    if (prevUser && prevUser.userIsSaving && !user.userIsSaving) {
      // If finished saving, save default recipes
      getDefaultRecipes(false);
    } else if (prevRecipes && prevRecipes.recipesIsFetching && !recipes.recipesIsFetching) {
      if (recipes.error !== '') {
        // Show alert
        Alert.alert(
          'Error Occurred',
          'Could not reach Drippy servers.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Skip sponsors if our server fails
                this.navigateNext();
              }
            },
          ],
        );
      } else {
        getSponsors();
      }
    } else if (prevSponsors && prevSponsors.sponsorsIsFetching && !sponsors.sponsorsIsFetching) {
      if (sponsors.error !== '') {
        // Show alert
        Alert.alert(
          'Error Occurred',
          'Could not reach Drippy servers.',
          [
            {
              text: 'OK',
              onPress: () => {
                this.navigateNext();
              }
            },
          ],
        );
      } else {
        // Preload images
        const preloadList = [];
        for (let i = 0; i < sponsors.sponsors.length; i += 1) {
          preloadList.push({
            uri: sponsors.sponsors[i].imageLink
          });
        }
        FastImage.preload(preloadList);
        this.navigateNext();
      }
    }
  }

  navigateNext = () => {
    const { navigation } = this.props;
    const { isFirstTime } = this.state;
    if (isFirstTime) {
      // Go to tutorial - we were in welcome
      navigation.navigate('Tutorial');
    } else {
      // Go to home - means user there
      navigation.navigate('Home');
    }
  }

  render() {
    const basePath = '../../assets/splash/';

    const { height } = Dimensions.get('window');
    const imageContainerMargin = {
      marginTop: height * 0.35
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Image style={[styles.logo, imageContainerMargin]} source={require(`${basePath}Splash_Logo.png`)} />
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
  logo: {
    height: '18%',
    resizeMode: 'contain',
    marginBottom: 50
  },
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
