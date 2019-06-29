
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import * as constants from '../builder/builder-constants';

class Entry extends Component {
	render() {
		const { title, description, vesselId, selected, onEntryClick, idx } = this.props

		const basePath = "../../assets/mini-vessel-icons/";

		var textviewDynamic = {}
		var titleMargin = 0
		if (selected) {
			textviewDynamic['flexDirection'] = 'column';
			textviewDynamic['flex'] = 1;
			titleMargin = 10
		} else {
			textviewDynamic['justifyContent'] = 'center';
			textviewDynamic['height'] = 55;
		}

		var titleAdditional = {
			marginBottom: titleMargin,
		}

		return (
			<TouchableWithoutFeedback onPress = {() => onEntryClick(idx)}>
				<View style={styles.outline}>
					<View style={styles.logoview}>
						{vesselId == constants.VESSEL_AEROPRESS &&
							<Image style={styles.image} source={require(basePath + "Aeropress_Minicon.png")} />}
						{vesselId == constants.VESSEL_CHEMEX &&
							<Image style={styles.image} source={require(basePath + "Chemex_Minicon.png")} />}
						{vesselId == constants.VESSEL_FRENCH_PRESS &&
							<Image style={styles.image} source={require(basePath + "FrenchPress_Minicon.png")} />}
						{vesselId == constants.VESSEL_POUROVER &&
							<Image style={styles.image} source={require(basePath + "V60_Minicon.png")} />}
					</View>
	        <View style={textviewDynamic}>
	          <Text style={[styles.title, titleAdditional]}>{title}</Text>
						{selected && <Text style={styles.description}>{description}</Text>}
	        </View>
				</View>
			</TouchableWithoutFeedback>
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
		height: 55,
    width: 55,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    marginRight: 16,
		justifyContent: 'center',
    alignItems: 'center',
	},
	image: {
		height: 35,
		resizeMode: 'contain',
	},
	textview: {
		justifyContent: 'center',
		height: 55,
		flexDirection:'column',
		flex: 1,
	},
  title: {
    color: '#1D5E9E',
    fontSize: 18,
		fontWeight: '600',
		justifyContent: 'center',
  },
  description: {
    color: '#727272',
    fontSize: 14,
  }
});

export default Entry;
