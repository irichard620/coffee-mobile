
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';

export default function Step(props) {
  const {
    onStepClick, onPressEdit, onPressUp, onPressDown, onPressDelete,
    selected, disabled, title, description, margin, canEdit, canGoUp, canGoDown
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  const backgroundStyle = {
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
  };

  return (
    <TouchableWithoutFeedback onPress={onStepClick} disabled={disabled}>
      <View style={[styles.outline, backgroundStyle]}>
        <View style={styles.topview}>
          <Text style={styles.title}>{title}</Text>
          {description !== '' && (
          <Text style={styles.description}>
            {description}
          </Text>
          )}
        </View>
        {selected && (
        <View style={styles.buttonview}>
          <View style={styles.rightbuttonview}>
            {canGoUp && (
            <TouchableOpacity onPress={onPressUp}>
              <Image style={styles.edit} source={require(`${baseButtonPath}Move_Up.png`)} />
            </TouchableOpacity>
            )}
            {canGoDown && (
            <TouchableOpacity onPress={onPressDown}>
              <Image style={styles.edit} source={require(`${baseButtonPath}Move_Down.png`)} />
            </TouchableOpacity>
            )}
            {canEdit && (
            <TouchableOpacity onPress={onPressEdit}>
              <Image style={styles.edit} source={require(`${baseButtonPath}Edit.png`)} />
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onPressDelete}>
              <Image style={styles.use} source={require(`${baseButtonPath}Delete.png`)} />
            </TouchableOpacity>
          </View>
        </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    alignItems: 'flex-start',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  title: {
    color: '#1D5E9E',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#727272',
    fontSize: 14,
  },
  topview: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  buttonview: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end'
  },
  rightbuttonview: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
