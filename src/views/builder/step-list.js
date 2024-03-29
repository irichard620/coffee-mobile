
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Step from './step';
import BuilderListHeader from './builder-list-header';

class StepList extends Component {
  renderItem = (step, idx) => {
    const {
      onPressEdit, onPressDelete, onPressUp, onPressDown, onStepClick, steps, selected,
      useMetric
    } = this.props;

    // Check if can go up and down
    let canGoUp = true;
    let canGoDown = true;
    if (idx === 0) {
      canGoUp = false;
    }
    if (idx === steps.length - 1) {
      canGoDown = false;
    }

    const showSeparator = (idx < steps.length - 1);

    return (
      <React.Fragment>
        <Step
          key={idx}
          step={step}
          useMetric={useMetric}
          canGoUp={canGoUp}
          canGoDown={canGoDown}
          selected={selected[idx]}
          onPressEdit={() => onPressEdit(idx, step.title)}
          onPressDelete={() => onPressDelete(idx)}
          onPressUp={() => onPressUp(idx)}
          onPressDown={() => onPressDown(idx)}
          onStepClick={() => onStepClick(idx)}
          margin={[0, 0, 0, 0]}
        />
        {showSeparator && <View style={styles.separator} />}
      </React.Fragment>
    );
  };

  render() {
    const { steps } = this.props;

    return (
      <View style={styles.outline}>
        {steps.length === 0 && (
          <Text style={styles.noStepText}>Add some steps to get your recipe started...</Text>
        )}
        {steps.length > 0 && <BuilderListHeader title="Steps" textColor="#2D8CD3" />}
        {steps.length > 0 && <View style={styles.separator} />}
        {steps.map((step, idx) => (
          this.renderItem(step, idx)
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    marginTop: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    width: '100%'
  },
  noStepText: {
    color: '#898989',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default StepList;
