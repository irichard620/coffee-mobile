
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Sponsor extends Component {
	render() {
		return (
			<View style={styles.outline}>
        <View style={styles.logo}>
          <Text style={styles.title}>Logo here</Text>
        </View>
        <Text style={styles.description}>{this.props.description}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	outline: {
    borderRadius: 20,
    marginLeft: 15,
		marginRight: 15,
		marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    width: '90%'
	},
  logo: {
    marginBottom: 65,
    marginTop: 65
  },
  title: {
    color: '#1D5E9E',
    fontSize: 20,
    alignSelf: 'center'
  },
  description: {
    color: '#727272',
    fontSize: 16,
    alignSelf: 'flex-start'
  }
});

export default Sponsor;
