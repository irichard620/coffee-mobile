
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as constants from './builder-constants';
import Step from './step';

class StepList extends Component {
  renderItem = (step, idx) => {
    const { onPressEdit, onPressDelete, onPressUp, onPressDown, steps, selected } = this.props

    // Check if can edit
    var type = step['type']
    var canEdit = false;
    if (type == constants.STEP_HEAT_WATER || type == constants.STEP_GRIND_COFFEE
    || type == constants.STEP_BLOOM_GROUNDS || type == constants.STEP_POUR_WATER
    || type == constants.STEP_WAIT) {
      canEdit = true;
    }

    // Check if can go up and down
    var canGoUp = true;
    var canGoDown = true;
    if (idx == 0) {
      canGoUp = false;
    }
    if (idx == steps.length - 1) {
      canGoDown = false;
    }

    return (<Step
      id={step['id']}
      title={step['title']}
      description={step['description']}
      type={type}
      canEdit={canEdit}
      canGoUp={canGoUp}
      canGoDown={canGoDown}
      selected={selected[idx]}
      onPressEdit={() => onPressEdit(step['id'], type)}
      onPressDelete={() => onPressDelete(step['id'])}
      onPressUp={() => onPressUp(step['id'])}
      onPressDown={() => onPressDown(step['id'])}
      onStepClick={() => onStepClick(idx)}
      margin={[0, 0, 0, 15]}
    />);
  };

	render() {
		const { steps } = this.props;

    return (
      <View>
        {steps.map((step, idx) => (
          this.renderItem(step, idx)
        ))}
      </View>
    );
	}
}

const styles = StyleSheet.create({

});

export default StepList;
