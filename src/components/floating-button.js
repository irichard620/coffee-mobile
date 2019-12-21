
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Text,
  TouchableWithoutFeedback
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function FloatingButton(props) {
  const {
    type, onFloatingClick, disabled
  } = props;

  const baseButtonPath = '../assets/buttons/floating-menu/';

  // Margin bottom dynamic
  let marginBottomToUse = 0;
  if (disabled && type !== 0) {
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
      <TouchableWithoutFeedback onPress={() => onFloatingClick(type)}>
        <View style={[styles.container, containerMarginBottom]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#6BA3D1', '#2D8CD3', '#1D5E9E']}
              style={styles.linearGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {type === 0 && disabled && <Image style={styles.icon} source={require(`${baseButtonPath}Hamburger.png`)} />}
              {type === 0 && !disabled && <Image style={styles.icon} source={require(`${baseButtonPath}CloseHamburger.png`)} />}
            </LinearGradient>
          </View>
        </View>
      </TouchableWithoutFeedback>
      )}
      {type !== 0 && (
      <TouchableOpacity onPress={() => onFloatingClick(type)} disabled={disabled}>
        <View style={[styles.container, containerMarginBottom]}>
          <View style={styles.iconContainer}>
            {type === 1 && <Image style={styles.floatingIcon} source={require(`${baseButtonPath}Menu_Settings.png`)} />}
            {type === 2 && <Image style={styles.floatingIcon} source={require(`${baseButtonPath}Menu_NewRecipe.png`)} />}
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
  linearGradient: {
    flex: 1,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
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
  floatingIcon: {
    height: 62,
    width: 62,
  },
  textStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  }
});
