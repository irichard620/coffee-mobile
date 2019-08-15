
import React, { Component } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions, LayoutAnimation
} from 'react-native';
import {
  settings, settingsOptions, CustomLayoutSpring, settingsDescriptions
} from '../../constants';
import Back from '../../components/back';
import SettingsCard from './settings-card';

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [false, false, false]
    };
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  onCardClick = (idx) => {
    const { selected } = this.state;

    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({
      selected: selected.map((val, i) => (i === idx ? !val : false))
    });
  }

  onPressItem = (item) => {

  }

  renderSettingCard = (idx, setting) => {
    const { selected } = this.state;

    return (
      <SettingsCard
        key={idx}
        idx={idx}
        type={setting}
        description={settingsDescriptions[setting]}
        options={settingsOptions[setting]}
        selected={selected[idx]}
        onCardClick={this.onCardClick}
        onPressItem={this.onPressItem}
      />
    );
  }

  render() {
    // Top margin - dynamic
    const { height } = Dimensions.get('window');
    const marginTopStyle = {
      marginTop: height * 0.03
    };

    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.backcontainer, marginTopStyle]}>
          <Back
            onBackClick={this.onBackClick}
            type={0}
          />
        </View>
        <Text style={styles.title}>Settings</Text>
        {settings.map((setting, idx) => (
          this.renderSettingCard(idx, setting)
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4'
  },
  backcontainer: {
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  title: {
    marginLeft: 15,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: '600',
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  }
});

export default SettingsPage;
