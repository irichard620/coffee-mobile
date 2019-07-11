
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, Dimensions, StyleSheet } from 'react-native';

import Button from '../../components/button';
import { fetchUser } from '../../actions/user-actions';
import { fetchDefaultRecipes } from '../../actions/recipe-actions';

class SplashPage extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	componentWillReceiveProps(nextProps) {
    const { user, recipes } = this.props

	  const nextUser = nextProps.user;
    const nextRecipes = nextProps.recipes;

    if (user && user.userIsFetching && !nextUser.userIsFetching) {
      // If finished fetching, check if we should go to welcome page
      if (Object.keys(nextUser.user).length == 0 || nextUser.user.name == "") {
        // Go to welcome page
        this.props.navigation.navigate('Welcome');
      } else {
        // Do default recipes if user there
        this.props.fetchDefaultRecipes();
      }
    } else if (recipes && recipes.recipesIsFetching && !nextRecipes.recipesIsFetching) {
      // Go to home - means user there
      this.props.navigation.navigate('Home');
    }
	}

	render() {
    const baseBrewPath = "../../assets/brew/";

    var {height, width} = Dimensions.get('window');
    imageContainerMargin = {
      marginTop: height * 0.35
    }

		return (
			<View style={styles.container}>
        <View style={[styles.imagecontainer, imageContainerMargin]}>
          <Image style={styles.logo} source={require(baseBrewPath + "Aeropress_Vessel.png")} />
        </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  imagecontainer: {
    height: '18%',
    alignItems: 'center',
  },
  logo: {
    height: '100%',
    resizeMode: 'contain'
  }
});

const mapStateToProps = (state) => ({ user: state.userReducer.user,
  recipes: state.recipesReducer.recipes });

const mapDispatchToProps = { fetchUser: fetchUser, fetchDefaultRecipes: fetchDefaultRecipes }

SplashPage = connect(mapStateToProps,mapDispatchToProps)(SplashPage)

export default SplashPage;
