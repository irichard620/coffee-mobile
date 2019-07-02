
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import * as constants from '../constants';

class ListItem extends Component {
	constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
		const { id, title } = this.props;

		var baseButtonPath = "../assets/buttons/menu/";

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={this.onPress}>
        <View style={styles.textcontainer}>
					{id == constants.RECIPE_MENU_EDIT && <Image style={styles.icon} source={require(baseButtonPath + "Menu_Edit.png")} />}
					{id == constants.RECIPE_MENU_FAVORITE && <Image style={styles.icon} source={require(baseButtonPath + "Menu_Favorite.png")} />}
					{id == constants.RECIPE_MENU_UNFAVORITE && <Image style={styles.icon} source={require(baseButtonPath + "Menu_Unfavorite.png")} />}
					{id == constants.RECIPE_MENU_DELETE && <Image style={styles.icon} source={require(baseButtonPath + "Menu_Delete.png")} />}
					{id == constants.RECIPE_MENU_CANCEL && <Image style={styles.icon} source={require(baseButtonPath + "Menu_Cancel.png")} />}
          <Text style={styles.listtitle}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listtitle: {
    fontSize: 16,
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  },
	textcontainer: {
		flexDirection: 'row',
		flexWrap: 'nowrap',
    paddingTop: 15,
    paddingBottom: 15
  },
	icon: {
		width: 16,
		height: 16,
		resizeMode: 'contain',
		marginRight: 15,
	}
});

export default ListItem;
