
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Text, Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

export default function FloatingButton(props) {
  const {
    type, onFloatingClick, disabled, transform
  } = props;

  const baseButtonPath = '../assets/buttons/';

  let transformStyle = {};
  if (transform) {
    transformStyle = {
      transform: [{ rotate: '45deg' }]
    };
  }

  const { width } = Dimensions.get('window');
  const marginLeftContainer = {
    marginLeft: (width / 2.0) - 31
  };

  return (
    <React.Fragment>
      {type === 0 && (
      <TouchableWithoutFeedback onPress={() => onFloatingClick(type)} disabled={disabled}>
        <View style={[styles.container, marginLeftContainer]}>
          {type === 0 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Menu_Main.png`)} />}
        </View>
      </TouchableWithoutFeedback>
      )}
      {type !== 0 && (
      <TouchableOpacity onPress={() => onFloatingClick(type)} disabled={disabled}>
        <View style={[styles.container, marginLeftContainer]}>
          {type === 1 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Menu_Settings.png`)} />}
          {type === 1 && <Text style={styles.textStyle}>Settings</Text>}
          {type === 2 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Menu_NewRecipe.png`)} />}
          {type === 2 && <Text style={styles.textStyle}>New Recipe</Text>}
        </View>
      </TouchableOpacity>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  icon: {
    width: 62,
    height: 62,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  textStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  }
});
