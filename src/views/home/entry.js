
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Entry extends Component {
	render() {
		return (
			<View style={styles.outline}>
				<View style={styles.logoview}>
					<View style={styles.circle}/>
				</View>
        <View style={styles.textview}>
          <Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.description}>{this.props.description}</Text>
        </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	outline: {
		alignItems: 'flex-start',
		flexDirection:'row',
		flexWrap:'nowrap',
    borderRadius: 20,
    width: '90%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
		marginRight: 15,
		marginTop: 0,
		marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    backgroundColor: '#FFFFFF'
	},
	logoview: {
	},
	textview: {
		flexDirection: 'column',
		flex: 1
	},
  titlerow: {
    alignItems: 'center',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8
  },
  circle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#1D5E9E',
    marginRight: 16
  },
  title: {
    color: '#1D5E9E',
    fontSize: 16,
		marginBottom: 10,
  },
  description: {
    color: '#727272',
    fontSize: 14,
  }
});

export default Entry;
