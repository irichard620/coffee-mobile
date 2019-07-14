
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
    const { type } = step;
    let canEdit = false;
    if (type === constants.STEP_HEAT_WATER || type === constants.STEP_GRIND_COFFEE
    || type === constants.STEP_BLOOM_GROUNDS || type === constants.STEP_POUR_WATER
    || type === constants.STEP_WAIT) {
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
        key={step.stepId}
        id={step.stepId}
        title={step.title}
        description={stepModel.getStepShortDescription(step)}
        type={type}
        canEdit={canEdit}
        canGoUp={canGoUp}
        canGoDown={canGoDown}
        selected={selected[idx]}
        onPressEdit={() => onPressEdit(step.stepId, type)}
        onPressDelete={() => onPressDelete(step.stepId)}
        onPressUp={() => onPressUp(step.stepId)}
        onPressDown={() => onPressDown(step.stepId)}
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
