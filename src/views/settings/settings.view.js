
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, ScrollView, StyleSheet, Alert, Linking
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import * as constants from '../../constants';
import {
  saveUsername, requestPurchaseIAP, restoreIAP
} from '../../actions/user-actions';
import TopHeader from '../../components/top-header';
import Detail from '../builder/detail';

class SettingsPage extends Component {
  purchaseUpdatePro = null;

  purchaseErrorPro = null;

  constructor(props) {
    super(props);

    this.state = {
      useMetric: false,
      premium: false
    };
  }

  componentDidMount() {
    const { user } = this.props;

    // Add user details to state
    if (user && Object.keys(user.user).length !== 0) {
      this.setState({
        useMetric: user.user.useMetric,
        premium: user.user.premium
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    const nextUser = nextProps.user;

    // Check if restore default worked
    if (user && user.userIsSaving && !nextUser.userIsSaving) {
      this.setState({
        useMetric: nextUser.user.useMetric
      });
    } else if (user && user.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      this.setState({
        premium: nextUser.user.premium
      });
    } else if (user && user.iapIsRestoring && !nextUser.iapIsRestoring) {
      this.setState({
        premium: nextUser.user.premium
      });
    }
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  onSettingsOptionClick = (option) => {
    const {
      navigation, buyDrippyPro, restoreDrippyPro
    } = this.props;
    if (option === constants.OPTION_GET_DRIPPY_PRO) {
      // Prompt if they want to purchase
      Alert.alert(
        'Buy Drippy Pro',
        'Would you like to purchase the pro version of Drippy? This will give you '
        + 'the ability to create and edit recipes, and will unlock unlimited recipe storage.',
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Buy',
            onPress: () => {
              buyDrippyPro();
            }
          },
        ],
      );
    } else if (option === constants.OPTION_RESTORE_PURCHASE) {
      // prompt if they want to restore
      Alert.alert(
        'Restore Drippy Pro',
        'Would you like to restore the pro version of Drippy?',
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Restore',
            onPress: () => {
              restoreDrippyPro();
            }
          },
        ],
      );
    } else if (option === constants.OPTION_TEMPERATURE_UNITS) {
      navigation.navigate('Temperature');
    } else if (option === constants.OPTION_REPLAY_INTRO) {
      // Pull up tutorial, pass in flag
      navigation.navigate({
        routeName: 'TutorialFromSettings',
        params: {
          fromSettings: true,
        },
        key: 'fromSettings'
      });
    } else if (option === constants.OPTION_MANAGE_DEFAULT_RECIPES) {
      navigation.navigate('DefaultRecipes');
    } else if (option === constants.OPTION_CONTACT_US || option === constants.OPTION_JOIN_BETA) {
      // Pull up email
      let emailLink = 'mailto:drippyapp@gmail.com';
      if (option === constants.OPTION_JOIN_BETA) {
        emailLink = `${emailLink}?subject=Request to join Drippy Beta`;
      }
      Linking.canOpenURL(emailLink).then((supported) => {
        if (supported) {
          Linking.openURL(emailLink);
        } else {
          // Open error alert
          Alert.alert(
            'Error Occurred',
            'The Email could not be opened.',
            [
              {
                text: 'OK'
              },
            ],
          );
        }
      });
    } else if (option === constants.OPTION_INSTAGRAM) {
      const instaLink = 'https://www.instagram.com/drippyapp/';
      Linking.canOpenURL(instaLink).then((supported) => {
        if (supported) {
          Linking.openURL(instaLink);
        } else {
          // Open error alert
          Alert.alert(
            'Error Occurred',
            'Could not open Instagram.',
            [
              {
                text: 'OK'
              },
            ],
          );
        }
      });
    }
  };

  renderOption = (option, idx) => {
    const { useMetric } = this.state;

    let value = '';
    if (option === constants.OPTION_TEMPERATURE_UNITS) {
      if (useMetric) {
        value = constants.CELSIUS;
      } else {
        value = constants.FAHRENHEIT;
      }
    }
    return (
      <Detail
        key={idx}
        value={value}
        title={option}
        modalId={option}
        onDetailClick={this.onSettingsOptionClick}
        showArrow
        showSeparator
      />
    );
  };

  renderSection = (section, idx) => {
    const { premium } = this.state;
    return (
      <View style={styles.sectionContainer} key={idx}>
        <Text style={styles.sectionHeader}>{section}</Text>
        {
          (!premium || section !== constants.SETTINGS_SECTION_PRO)
          && constants.settingsOptions[section].map((detail, optionIdx) => (
            this.renderOption(
              detail, optionIdx
            )
          ))
        }
        {
          (premium && section === constants.SETTINGS_SECTION_PRO)
          && (
            <Text style={styles.proText}>
              Thanks for purchasing Drippy Pro and supporting our team!
            </Text>
          )
        }
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TopHeader title="Settings" onClose={this.onBackClick} showSeparator={false} />
        <ScrollView style={styles.scrollContainer}>
          {constants.settingsSections.map((section, idx) => (
            this.renderSection(section, idx)
          ))}
          <Text style={styles.versionText}>Drippy V2.0.0</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },
  sectionContainer: {
    marginBottom: 24
  },
  sectionHeader: {
    color: '#898989',
    fontSize: 13,
    marginLeft: 16,
    marginBottom: 8,
  },
  proText: {
    fontSize: 16,
    color: '#898989',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 14,
  },
  versionText: {
    marginTop: 8,
    color: '#C6C6C6',
    fontSize: 12,
    textAlign: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    marginLeft: 16
  }
});

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  persistUsername: saveUsername,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
