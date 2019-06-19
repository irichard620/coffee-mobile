
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class Step extends Component {
	render() {
    const { onStepClick, disabled, title, description, margin } = this.props

    backgroundStyle = {
      marginTop: margin[0],
      marginRight: margin[1],
      marginBottom: margin[2],
      marginLeft: margin[3],
    };

		return (
      <TouchableHighlight
        disabled={disabled}
        style={[styles.outline, backgroundStyle]}
        onPress = { onStepClick }
      >
  			<View>
          <Text style={styles.title}>{title}</Text>
          {description != '' &&
            <Text style={styles.description}>{description}
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
