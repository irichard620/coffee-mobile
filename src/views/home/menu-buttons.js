
import React from 'react';
import {
  View, StyleSheet, Text, TouchableWithoutFeedback, Dimensions
} from 'react-native';

export default function MenuButtons(props) {
  const {
    selected, onItemClick
  } = props;

  const renderOrder = [0, 1, 2];
  const { width } = Dimensions.get('window');
  const outlineWidth = {
    width: width - 32
  };
  const buttonWidth = {
    width: outlineWidth.width / 3
  };
  const selectedButtonStyle = {
    width: buttonWidth.width - 12, // 6 buffer on each side
    left: 6
  };
  selectedButtonStyle.left += selected * buttonWidth.width;

  return (
    <View style={[styles.outline, outlineWidth]}>
      {renderOrder.map((item) => {
        // style of button
        let titleStyle = {
          color: '#898989'
        };
        if (selected === item) {
          titleStyle = {
            color: '#399DFF'
          };
        }

        // Title of button
        let title = '';
        if (item === 1) {
          title = 'FAVORITES';
        } else if (item === 0) {
          title = 'ALL RECIPES';
        } else {
          title = 'FEATURED';
        }
        return (
          <TouchableWithoutFeedback
            onPress={() => onItemClick(item)}
            key={title}
          >
            <View style={[styles.buttonOutline, buttonWidth]}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
      <View style={[styles.selectedButtonOutline, selectedButtonStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    flex: 1,
    marginBottom: 16,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E9ECF0',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: 38,
  },
  selectedButtonOutline: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    height: 38,
    borderRadius: 8,
    zIndex: 1
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
  },
});
