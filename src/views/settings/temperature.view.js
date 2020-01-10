import React, { Component } from 'react';
import {
  View, StyleSheet, Alert, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import TopHeader from '../../components/top-header';
import { updateTemperatureUnits } from '../../actions/user-actions';
import ListItem from '../../components/list-item';
import * as constants from '../../constants';

class TemperaturePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      useMetric: false,
    };
  }

  componentDidMount() {
    const { user } = this.props;

    // Add user details to state
    if (user && Object.keys(user.user).length !== 0) {
      this.setState({
        useMetric: user.user.useMetric,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    const nextUser = nextProps.user;

    // Check if unit update worked
    if (user && user.userIsSaving && !nextUser.userIsSaving) {
      // Show success alert
      Alert.alert(
        'Settings Updated',
        'Your changes have been saved.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                useMetric: nextUser.user.useMetric
              });
            }
          },
        ],
      );
    }
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onPressItem = (item) => {
    const { changeTemperatureUnits } = this.props;
    const { useMetric } = this.state;

    if (
      (item === constants.CELSIUS && !useMetric)
      || (item === constants.FAHRENHEIT && useMetric)
    ) {
      // Prompt if they want to toggle temp unit
      let newUnit = constants.CELSIUS;
      if (useMetric) {
        newUnit = constants.FAHRENHEIT;
      }
      Alert.alert(
        'Change Temperature Units',
        `Would you like to toggle your temperature unit to ${newUnit}?`,
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Toggle',
            onPress: () => {
              changeTemperatureUnits(!useMetric);
            }
          },
        ],
      );
    }
  };

  render() {
    const { useMetric } = this.state;

    return (
      <View style={styles.container}>
        <TopHeader title="Temperature Units" onClose={this.onBackClick} showSeparator={false} useArrow />
        <ScrollView style={styles.scrollContainer}>
          <ListItem
            title={constants.CELSIUS}
            selected={useMetric}
            onPressItem={this.onPressItem}
          />
          <ListItem
            title={constants.FAHRENHEIT}
            selected={!useMetric}
            onPressItem={this.onPressItem}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {

  }
});

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  changeTemperatureUnits: updateTemperatureUnits,
};

export default connect(mapStateToProps, mapDispatchToProps)(TemperaturePage);
