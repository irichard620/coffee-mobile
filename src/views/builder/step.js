
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class Step extends Component {
	render() {
		return (
      <TouchableHighlight
        disabled={this.props.disabled}
        style={styles.outline}
        onPress = { this.props.onStepClick }
      >
  			<View>
          <Text style={styles.title}>{this.props.title}</Text>
          {this.props.description != '' && 
            <Text style={styles.description}>{this.props.description}
            </Text>}
  			</View>
      </TouchableHighlight>
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
  },
  description: {
    color: '#727272',
    fontSize: 14,
  }
});

export default Step;
