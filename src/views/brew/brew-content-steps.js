
import React, { Component } from 'react';
import {
  View, StyleSheet, Image, ScrollView, Text, Dimensions
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as constants from '../../constants';
import Pagination from '../../components/pagination';
import * as stepModel from '../../storage/step';
import BrewStep from './brew-step';

class BrewContentSteps extends Component {
  getIcon = (recipe) => {
    const { step, timerRemaining, timerTotal } = this.props;

    const baseBrewPath = '../../assets/brew/';

    if (step < recipe.steps.length) {
      // Get step
      const stepObj = recipe.steps[step];
      if (stepObj.title === constants.STEP_HEAT_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}HeatWater.png`)} />);
      } if (stepObj.title === constants.STEP_CHILL_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}ChillWater.png`)} />);
      } if (stepObj.title === constants.STEP_INSERT_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}InsertFilter.png`)} />);
      } if (stepObj.title === constants.STEP_RINSE_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}RinseFilter.png`)} />);
      } if (stepObj.title === constants.STEP_BLOOM_GROUNDS
        || stepObj.title === constants.STEP_POUR_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}PourWater.png`)} />);
      } if (stepObj.title === constants.STEP_GRIND_COFFEE
        || stepObj.title === constants.STEP_ADD_GROUNDS) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}GrindBeans.png`)} />);
      } if (stepObj.title === constants.STEP_ADD_ICE) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}AddIce.png`)} />);
      } if (stepObj.title === constants.STEP_STIR) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Stir.png`)} />);
      } if (stepObj.title === constants.STEP_INSERT_PLUNGER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}InsertPlunger_Aero.png`)} />);
      } if (stepObj.title === constants.STEP_PUSH_PLUNGER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Plunge_Aero.png`)} />);
      } if (stepObj.title === constants.STEP_PUSH_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Plunge_FP.png`)} />);
      } if (stepObj.title === constants.STEP_STEEP) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Steep.png`)} />);
      } if (stepObj.title === constants.STEP_WAIT) {
        // Get fill number
        const fill = Math.round((timerRemaining / timerTotal) * 100);
        const { height } = Dimensions.get('window');
        const timerSize = height * 0.32;

        return (
          <AnimatedCircularProgress
            size={timerSize}
            width={15}
            fill={fill}
            tintColor="#a7d2ea"
            backgroundColor="#F4F4F4"
          >
            {
              () => (
                <Text style={styles.timertext}>
                  { this.getTimerDisplay() }
                </Text>
              )
            }
          </AnimatedCircularProgress>
        );
      }
    }
    // End image
    return (<Image style={styles.icon} source={require(`${baseBrewPath}Complete.png`)} />);
  };

  renderBrewStep = (stepObj, idx) => {
    const { recipe, useMetric, step } = this.props;
    const { steps, brewingVessel } = recipe;

    let description = '';
    if (idx < steps.length) {
      description = stepModel.getStepDescription(stepObj, useMetric, brewingVessel);
      if (('notes' in stepObj) && stepObj.notes !== '') {
        description = `${description} ${stepObj.notes}`;
      }
    } else {
      description = 'Enjoy your coffee!';
    }

    return (
      <React.Fragment>
        <BrewStep
          title={stepObj.title}
          description={description}
          activeStep={(step === idx)}
        />
        <View style={styles.mainSeparator} />
      </React.Fragment>
    );
  };

  renderBrewSteps = () => {
    const { recipe, step } = this.props;
    const { steps, brewingVessel } = recipe;

    const stepsToUse = steps.slice(step);

    return (
      <React.Fragment>
        {stepsToUse.map((stepObj, idx) => (
          this.renderBrewStep(stepObj, idx)
        ))}
        {brewingVessel !== constants.VESSEL_MIZUDASHI && (
          this.renderBrewStep({ title: 'Brew Complete' }, steps.length)
        )}
      </React.Fragment>
    );
  };

  render() {
    const { recipe, step } = this.props;
    const { steps, brewingVessel } = recipe;

    const { height } = Dimensions.get('window');
    const iconHeight = {
      height: height * 0.32,
    };

    // Pagination
    let stepsLength = 0;
    if (steps && steps.length > 0) {
      if (brewingVessel === constants.VESSEL_MIZUDASHI) {
        stepsLength = steps.length;
      } else {
        stepsLength = steps.length + 1;
      }
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={false}
      >
        <View style={[styles.iconView, iconHeight]}>
          {this.getIcon(recipe)}
        </View>
        <Pagination
          total={stepsLength}
          index={step}
          activeColor="#1D5E9E"
        />
        <View style={styles.topSeparator} />
        {steps && steps.length > 0 && this.renderBrewSteps()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
  },
  scrollViewContent: {
    alignItems: 'center'
  },
  iconView: {
    marginBottom: 8,
  },
  icon: {
    height: '100%',
    resizeMode: 'contain'
  },
  topSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F3F6',
    marginTop: 32,
  },
  mainSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F3F6',
  }
});

export default BrewContentSteps;
