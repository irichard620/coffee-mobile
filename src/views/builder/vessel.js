
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

class Vessel extends Component {
	render() {
		return (
      <TouchableWithoutFeedback onPress = { this.props.onStepClick }>
        <View style={styles.outline}>
          <View style={styles.circle}/>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.description}>{this.props.description}</Text>
        </View>
      </TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	outline: {
		alignItems: 'flex-start',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
		marginRight: 15,
		marginTop: 0,
		marginBottom: 15,
    backgroundColor: '#FFFFFF'
	},
  title: {
    color: '#1D5E9E',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#727272',
    fontSize: 14,
  },
  circle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#1D5E9E',
    marginBottom: 25
  }
});

export default Vessel;
