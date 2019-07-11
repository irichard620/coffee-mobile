
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, Dimensions, StyleSheet, Image, TouchableWithoutFeedback,
  TextInput } from 'react-native';

import Button from '../../components/button';
import { fetchDefaultRecipes } from '../../actions/recipe-actions';
import { saveUsername } from '../../actions/user-actions';

class WelcomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      step: 0,
      name: "",
    };
  }

	componentWillReceiveProps(nextProps) {
    const { user, recipes } = this.props

	  const nextUser = nextProps.user;
    const nextRecipes = nextProps.recipes;

    if (user && user.userIsSaving && !nextUser.userIsSaving) {
      // If finished saving, save default recipes
      this.props.fetchDefaultRecipes();
    } else if (recipes && recipes.recipesIsFetching && !nextRecipes.recipesIsFetching) {
      // Go to home - means recipes there
      this.props.navigation.navigate('Tutorial');
    }
	}

  onNextClick = () => {
    const { step, name } = this.state;

    if (step == 0) {
      this.setState({
        step: 1
      })
    } else if (step == 1) {
      this.props.saveUsername(name)
      this.setState({
        step: 2
      })
    } else {
      this.props.navigation.goBack();
    }
  }

  onChangeText = (text) => {
    this.setState({
      name: text
    })
  }

	render() {
    const { step, name } = this.state;

    const baseBrewPath = "../../assets/brew/";
    const baseButtonPath = "../../assets/buttons/";

    var {height, width} = Dimensions.get('window');
    imageContainerMargin = {
      marginTop: height * 0.16
    }

    var title = ""
    if (step == 0) {
      title = "Welcome to Drippy!"
    } else if (step == 1) {
      title = "What's your first name?"
    } else {
      title = "Great! Let's get brewing..."
    }

		return (
			<View style={styles.container}>
        <Image style={[styles.logo, imageContainerMargin]} source={require(baseBrewPath + "Aeropress_Vessel.png")} />
        <Text style={styles.title}>{title}</Text>
        {step == 1 && <TextInput
          onChangeText={(text) => this.onChangeText(text)}
          value={name}
          placeholder={"First Name"}
          placeholderTextColor='#b7b3b3'
          style={styles.textinput}
        />}
        <View style={styles.buttonview}>
          {step != 2 &&
            <TouchableWithoutFeedback onPress = {this.onNextClick}>
              <Image style={[styles.mini]} source={require(baseButtonPath + "Go.png")} />
            </TouchableWithoutFeedback>}
        </View>
			</View>
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

const mapStateToProps = (state) => ({ user: state.userReducer.user,
  recipes: state.recipesReducer.recipes });

const mapDispatchToProps = { saveUsername: saveUsername, fetchDefaultRecipes: fetchDefaultRecipes }

WelcomePage = connect(mapStateToProps,mapDispatchToProps)(WelcomePage)

export default WelcomePage;
