
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, Dimensions, StyleSheet, Image, TouchableWithoutFeedback,
  TextInput } from 'react-native';

import Button from '../../components/button';
import Entry from '../home/entry';
import Add from '../../components/add';
import * as constants from '../../constants';

class WelcomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  onNextClick = () => {
    const { step } = this.state;

    if (step < 4) {
      this.setState({
        step: step + 1
      })
    } else {
      this.props.navigation.navigate('Home');
    }
  }

	render() {
    const { step } = this.state;

    const baseBrewPath = "../../assets/brew/";
    const baseButtonPath = "../../assets/buttons/";

    var {height, width} = Dimensions.get('window');
    imageContainerMargin = {
      marginTop: height * 0.16
    }

    var title = ""
    if (step == 0) {
      title = "Drippy makes great coffee easy. Let’s show you how…"
    } else if (step == 1) {
      title = "View all custom recipes, or just your favorites. When you feel ready, make your own— just tap the plus!"
    } else if (step == 2) {
      title = "Each recipe has its own card."
    } else if (step == 3) {
      title = "Tap to expand. You can start the recipe… or tap more to edit, unfavorite, or delete it."
    } else {
      title = "Download cafe recipes, try new beans, and more. Now let’s get to it!"
    }

    var recipeDescription = "Inverted with a paper filter\n17g coffee, medium grind\n230g of water, 205°F"
    var entrySelected = false
    if (step == 3) {
      entrySelected = true
    }

		return (
			<View style={styles.container}>
        {step == 1 &&
          <View style={styles.showview}>
            <Button
              type={1}
              title={'Favorites'}
              width={'39%'}
              margin={[0, 0, 10, 0]}
              disabled={true}
            />
            <Button
              type={1}
              title={'Custom'}
              width={'39%'}
              margin={[0, 0, 10, 0]}
              disabled={true}
            />
            <Add
              type={1}
              disabled={true}
            />
          </View>}
        {(step == 2 || step == 3) &&
          <View style={styles.showview}>
            <Entry
              disabled={true}
              idx={0}
              selected={entrySelected}
              vesselId={constants.VESSEL_AEROPRESS}
              title={"Intro to the Aeropress"}
              description={recipeDescription}
            />
          </View>}
        <View style={styles.textview}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.buttonview}>
          <TouchableWithoutFeedback onPress = {this.onNextClick}>
            <Image style={[styles.mini]} source={require(baseButtonPath + "Go.png")} />
          </TouchableWithoutFeedback>
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
  showview: {
    width: '100%',
    position: 'absolute',
    top: '14%',
    alignItems: 'center'
  },
  textview: {
    width: '90%',
    position: 'absolute',
    top: '41%',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1D5E9E',
    textAlign: 'center'
  },
  buttonview: {
    position: 'absolute',
    top: '80%',
    width: 40,
  },
  mini: {
		height: 40,
    width: 40
	}
});

export default WelcomePage;
