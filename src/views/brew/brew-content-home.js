
import React, { Component } from 'react';
import {
  View, StyleSheet, Image, ScrollView, Text, Dimensions
} from 'react-native';
import * as constants from '../../constants';
import BrewDetail from './brew-detail';

class BrewContentHome extends Component {
  getVesselIcon = (vessel) => {
    const baseBrewPath = '../../assets/brew/';

    if (vessel === constants.VESSEL_AEROPRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Aero.png`)} />);
    } if (vessel === constants.VESSEL_CHEMEX) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Chemex.png`)} />);
    } if (vessel === constants.VESSEL_FRENCH_PRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_FP.png`)} />);
    } if (vessel === constants.VESSEL_MIZUDASHI) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Mizudashi.png`)} />);
    } if (vessel === constants.VESSEL_KALITA_WAVE) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_KalitaWave.png`)} />);
    }
    return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_V60.png`)} />);
  };

  renderBrewDetail = (detail, idx) => {
    const { onDetailClick } = this.props;
    return (
      <BrewDetail
        key={idx}
        title={detail}
        value=""
        onDetailClick={onDetailClick}
      />
    );
  };

  render() {
    const { recipe } = this.props;

    let description = '';
    if (recipe.recipeDescription && recipe.recipeDescription !== '') {
      description = recipe.recipeDescription;
    }

    const { height } = Dimensions.get('window');
    const iconHeight = {
      height: height * 0.27,
    };

    return (
      <ScrollView style={styles.scrollView}>
        <View style={[styles.iconView, iconHeight]}>
          {this.getVesselIcon(recipe.brewingVessel)}
        </View>
        {description !== '' && <View style={styles.separator} />}
        {description !== '' && <Text stye={styles.description}>{description}</Text>}
        {description !== '' && <View style={styles.separator} />}
        {constants.brewDetails.map((detail, idx) => (
          this.renderBrewDetail(detail, idx)
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 16
  },
  iconView: {
    marginBottom: 16,
    alignSelf: 'center'
  },
  icon: {
    height: '100%',
    resizeMode: 'contain'
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    marginBottom: 16,
    marginTop: 16,
  },
  description: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'left',
  }
});

export default BrewContentHome;
