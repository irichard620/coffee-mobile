
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import * as constants from '../../constants';
import { getTempUnit, translateTempToCelsius } from '../../storage/helper';
import { getStepShortDescription } from '../../storage/step';

class Step extends Component {
  getStepDescriptionWithHighlights = (step, useMetric) => {
    if (step.title === constants.STEP_HEAT_WATER) {
      const tempUnit = getTempUnit(useMetric);
      const tempToUse = useMetric
        ? translateTempToCelsius(step.properties.waterTemp) : step.properties.waterTemp;
      return (
        <Text style={styles.descriptionBase}>
          Heat water to
          <Text style={styles.descriptionHighlight}>
            {' '}
            {tempToUse}
            {tempUnit}
          </Text>
          .
        </Text>
      );
    } if (step.title === constants.STEP_CHILL_WATER) {
      return (
        <Text style={styles.descriptionBase}>
          Chill at least
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.gramsWater}
            {' '}
          </Text>
          grams of filtered water.
        </Text>
      );
    } if (step.title === constants.STEP_GRIND_COFFEE) {
      return (
        <Text style={styles.descriptionBase}>
          <Text style={styles.descriptionHighlight}>
            {step.properties.gramsCoffee}
            {' '}
          </Text>
          grams of coffee ground
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.grindSize}
          </Text>
          .
        </Text>
      );
    } if (step.title === constants.STEP_BLOOM_GROUNDS) {
      return (
        <Text style={styles.descriptionBase}>
          Bloom grounds with
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.gramsWater}
            {' '}
          </Text>
          grams of water.
        </Text>
      );
    } if (step.title === constants.STEP_POUR_WATER) {
      return (
        <Text style={styles.descriptionBase}>
          Pour in
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.gramsWater}
            {' '}
          </Text>
          grams of water.
        </Text>
      );
    } if (step.title === constants.STEP_WAIT) {
      return (
        <Text style={styles.descriptionBase}>
          Wait
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.seconds}
            {' '}
          </Text>
          seconds.
        </Text>
      );
    } if (step.title === constants.STEP_ADD_ICE) {
      return (
        <Text style={styles.descriptionBase}>
          Add
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.gramsIce}
            {' '}
          </Text>
          grams of ice..
        </Text>
      );
    } if (step.title === constants.STEP_STEEP) {
      return (
        <Text style={styles.descriptionBase}>
          Refrigerate and allow grounds to steep for
          <Text style={styles.descriptionHighlight}>
            {' '}
            {step.properties.hours}
            {' '}
          </Text>
          hours.
        </Text>
      );
    }
    // If no variables, just return normal text
    return <Text style={styles.descriptionBase}>{getStepShortDescription(step, useMetric)}</Text>;
  }

  render() {
    const {
      onStepClick, onPressEdit, onPressUp, onPressDown, onPressDelete,
      selected, disabled, step, useMetric, margin, canGoUp, canGoDown
    } = this.props;

    const baseButtonPath = '../../assets/buttons/';

    const backgroundStyle = {
      marginTop: margin[0],
      marginRight: margin[1],
      marginBottom: margin[2],
      marginLeft: margin[3],
    };

    const { title } = step;
    let canEdit = false;
    if (title === constants.STEP_HEAT_WATER || title === constants.STEP_CHILL_WATER
      || title === constants.STEP_GRIND_COFFEE || title === constants.STEP_BLOOM_GROUNDS
      || title === constants.STEP_POUR_WATER || title === constants.STEP_WAIT
      || title === constants.STEP_STEEP) {
      canEdit = true;
    }

    return (
      <TouchableWithoutFeedback onPress={onStepClick} disabled={disabled}>
        <View style={[styles.outline, backgroundStyle]}>
          <View style={styles.topview}>
            <Text style={styles.title}>{title}</Text>
            {this.getStepDescriptionWithHighlights(step, useMetric)}
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
}

const styles = StyleSheet.create({
  outline: {
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionBase: {
    color: '#898989',
    fontSize: 15,
  },
  descriptionHighlight: {
    color: '#2D8CD3',
    fontSize: 15,
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

export default Step;
