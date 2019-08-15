
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Text,
  TouchableWithoutFeedback, Animated
} from 'react-native';

export default function FloatingButton(props) {
  const {
    type, onFloatingClick, disabled, spinValue
  } = props;

  const baseButtonPath = '../assets/buttons/';
  console.log(spinValue);
  let transformStyle = {};
  if (type === 0) {
    transformStyle = {
      transform: [{ rotate: spinValue }]
    };
  }

  let iconContainerColor = '#FFFFFF';
  if (type === 0) {
    iconContainerColor = '#1D5E9E';
  }
  const iconContainerBackgroundStyle = {
    backgroundColor: iconContainerColor
  };

  // Margin bottom dynamic
  let marginBottomToUse = 0;
  if (disabled) {
    // Hide behind
    marginBottomToUse = -62;
  } else if (!disabled && type !== 0) {
    marginBottomToUse = 15;
  }
  const containerMarginBottom = {
    marginBottom: marginBottomToUse
  };

  return (
    <React.Fragment>
      {type === 0 && (
      <TouchableWithoutFeedback onPress={() => onFloatingClick(type)} disabled={disabled}>
        <View style={[styles.container, containerMarginBottom]}>
          <View style={[styles.iconContainer, iconContainerBackgroundStyle]}>
            {type === 0 && <Animated.Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}MenuIcon_Main.png`)} />}
          </View>
        </View>
      </TouchableWithoutFeedback>
      )}
      {type !== 0 && (
      <TouchableOpacity onPress={() => onFloatingClick(type)} disabled={disabled}>
        <View style={[styles.container, containerMarginBottom]}>
          <View style={[styles.iconContainer, iconContainerBackgroundStyle]}>
            {type === 1 && <Image style={styles.icon} source={require(`${baseButtonPath}MenuIcon_Settings.png`)} />}
            {type === 2 && <Image style={styles.icon} source={require(`${baseButtonPath}MenuIcon_NewRecipe.png`)} />}
          </View>
          {type === 1 && !disabled && <Text style={styles.textStyle}>Settings</Text>}
          {type === 2 && !disabled && <Text style={styles.textStyle}>New Recipe</Text>}
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
    justifyContent: 'flex-start'
  },
  iconContainer: {
    backgroundColor: '#1D5E9E',
    width: 62,
    height: 62,
    borderRadius: 31,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 22,
    resizeMode: 'contain'
  },
  textStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  }
});
