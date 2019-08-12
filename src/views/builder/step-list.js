
import React, { Component } from 'react';
import { View } from 'react-native';
import * as constants from '../../constants';
import * as stepModel from '../../storage/step';
import Step from './step';

class StepList extends Component {
  renderItem = (step, idx) => {
    const {
      onPressEdit, onPressDelete, onPressUp, onPressDown, onStepClick, steps, selected
    } = this.props;

    // Check if can edit
    const { title } = step;
    let canEdit = false;
    if (title === constants.STEP_HEAT_WATER || title === constants.STEP_GRIND_COFFEE
    || title === constants.STEP_BLOOM_GROUNDS || title === constants.STEP_POUR_WATER
    || title === constants.STEP_WAIT) {
      canEdit = true;
    }

    // Check if can go up and down
    let canGoUp = true;
    let canGoDown = true;
    if (idx === 0) {
      canGoUp = false;
    }
    if (idx === steps.length - 1) {
      canGoDown = false;
    }

    return (
      <Step
        key={idx}
        description={stepModel.getStepShortDescription(step)}
        title={title}
        canEdit={canEdit}
        canGoUp={canGoUp}
        canGoDown={canGoDown}
        selected={selected[idx]}
        onPressEdit={() => onPressEdit(idx, title)}
        onPressDelete={() => onPressDelete(idx)}
        onPressUp={() => onPressUp(idx)}
        onPressDown={() => onPressDown(idx)}
        onStepClick={() => onStepClick(idx, true)}
        margin={[0, 15, 15, 15]}
      />
    );
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

export default StepList;
