
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

class BuilderPage extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<ScrollView style={styles.container}>
        <Text style={styles.title}>Recipe Builder</Text>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: '#F4F4F4'
	},
  title: {
		marginTop: 70,
    marginLeft: 15,
		marginBottom: 20,
    fontSize: 28,
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  }
});

export default BuilderPage;
