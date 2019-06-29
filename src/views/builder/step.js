
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';

class Step extends Component {
	render() {
    const { onStepClick, onPressEdit, onPressUp, onPressDown, onPressDelete,
      selected, disabled, id, title, description, margin, canEdit, canGoUp, canGoDown } = this.props

    const baseButtonPath = "../../assets/buttons/";

    backgroundStyle = {
      marginTop: margin[0],
      marginRight: margin[1],
      marginBottom: margin[2],
      marginLeft: margin[3],
    };

		return (
      <TouchableWithoutFeedback onPress = {onStepClick} disabled={disabled}>
				<View style={[styles.outline, backgroundStyle]}>
					<View style={styles.topview}>
            <Text style={styles.title}>{title}</Text>
            {description != '' &&
              <Text style={styles.description}>{description}
              </Text>}
					</View>
					{selected && <View style={styles.buttonview}>
						<Image style={styles.close} source={require(baseButtonPath + "Close.png")} />
						<View style={styles.rightbuttonview}>
              {canGoUp && <TouchableWithoutFeedback onPress = {onPressUp}>
                <Image style={styles.edit} source={require(baseButtonPath + "Move_Up.png")} />
              </TouchableWithoutFeedback>}
              {canGoDown && <TouchableWithoutFeedback onPress = {onPressDown}>
                <Image style={styles.edit} source={require(baseButtonPath + "Move_Down.png")} />
              </TouchableWithoutFeedback>}
							{canEdit && <TouchableWithoutFeedback onPress = {onPressEdit}>
								<Image style={styles.edit} source={require(baseButtonPath + "Edit.png")} />
							</TouchableWithoutFeedback>}
							<TouchableWithoutFeedback onPress = {onPressDelete}>
								<Image style={styles.use} source={require(baseButtonPath + "Delete.png")} />
							</TouchableWithoutFeedback>
						</View>
					</View>}
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
    backgroundColor: '#FFFFFF'
	},
  title: {
    color: '#1D5E9E',
    fontSize: 16,
  },
  description: {
    color: '#727272',
    fontSize: 14,
  },
  topview: {
		alignItems: 'flex-start',
		flexDirection:'column',
	},
  buttonview: {
		marginTop: 20,
		display: 'flex',
		flexDirection:'row',
		flexWrap:'nowrap',
		justifyContent: 'space-between'
	},
	close: {
		height: 25,
    width: 25,
		alignSelf: 'flex-end',
		justifyContent: 'flex-start'
	},
	rightbuttonview: {
		flexDirection:'row',
		flexWrap:'nowrap',
		justifyContent: 'flex-start'
	},
	edit: {
		height: 40,
    width: 40,
		marginRight: 15
	},
	use: {
		height: 40,
    width: 40,
	}
});

export default Step;
