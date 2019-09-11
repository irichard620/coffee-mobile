
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, ScrollView, StyleSheet, Dimensions, LayoutAnimation, Alert,
  Keyboard, Platform
} from 'react-native';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap';
import {
  settings, settingsOptions, CustomLayoutSpring, settingsDescriptions, OPTION_NAME,
  OPTION_TEMP_UNITS, OPTION_HIDE_DEFAULT, OPTION_RESTORE_DEFAULT, OPTION_REPLAY_TUTORIAL,
  USER_NAME_ELEM, OPTION_GET_DRIPPY_PRO, OPTION_RESTORE_PURCHASE, SETTINGS_PRO_EXISTS,
  SETTINGS_PRO
} from '../../constants';
import Back from '../../components/back';
import SettingsCard from './settings-card';
import BuilderModal from '../builder/builder-modal';
import {
  fetchDefaultRecipes, hideDefaultRecipes
} from '../../actions/recipe-actions';
import {
  saveUsername, updateTemperatureUnits, requestPurchaseIAP, restoreIAP,
  upgradeIAP
} from '../../actions/user-actions';

class SettingsPage extends Component {
  purchaseUpdatePro = null;

  purchaseErrorPro = null;

  constructor(props) {
    super(props);

    this.state = {
      selected: [false, false, false],
      visibleModal: false,
      username: '',
      modalText: '',
      useMetric: false,
      premium: false
    };
  }

  componentDidMount() {
    const { user, upgradeDrippyPro } = this.props;

    // Purchase updated handler
    this.purchaseUpdatePro = purchaseUpdatedListener((purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        // Update in our system - wait for callback
        upgradeDrippyPro(purchase);
      }
    });

    // Purchase error handler
    this.purchaseErrorPro = purchaseErrorListener(() => {
      // Show alert
      Alert.alert(
        'Error purchasing Drippy Pro',
        'An error occurred purchasing pro version of Drippy.',
        [
          {
            text: 'OK',
          },
        ],
      );
    });

    // Add user details to state
    if (user && Object.keys(user.user).length !== 0 && ('name' in user.user)) {
      this.setState({
        username: user.user.name,
        useMetric: user.user.useMetric,
        premium: user.user.premium
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { recipes, user } = this.props;
    const nextRecipes = nextProps.recipes;
    const nextUser = nextProps.user;

    // Check if restore default worked
    if (recipes && recipes.recipesIsFetching && !nextRecipes.recipesIsFetching) {
      if (nextRecipes.error !== '') {
        // Show fail alert
        Alert.alert(
          'Error Occurred',
          'Could not reach Drippy servers. Please try again later.',
          [
            {
              text: 'OK',
            },
          ],
        );
      } else {
        // Show success alert
        Alert.alert(
          'Default Recipes Restored',
          'The Drippy default recipes have been re-added to your library.',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } else if (recipes && recipes.recipeIsDeleting && !nextRecipes.recipeIsDeleting) {
      // Show success alert
      Alert.alert(
        'Default Recipes Hidden',
        'All default recipes have been hidden from your library.',
        [
          {
            text: 'OK',
          },
        ],
      );
    } else if (user && user.userIsSaving && !nextUser.userIsSaving) {
      // Show success alert
      Alert.alert(
        'Settings Updated',
        'Your changes have been saved.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                visibleModal: false,
                modalText: '',
                username: nextUser.user.name,
                useMetric: nextUser.user.useMetric
              });
            }
          },
        ],
      );
    } else if (user && user.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      // Finish transaction
      if (Platform.OS === 'ios') {
        RNIap.finishTransactionIOS(nextUser.purchase.transactionId);
      } else if (Platform.OS === 'android') {
        RNIap.acknowledgePurchaseAndroid(nextUser.purchase.purchaseToken);
      }
      this.setState({
        premium: nextUser.user.premium
      });
    } else if (user && user.iapIsRestoring && !nextUser.iapIsRestoring) {
      // Update user
      if (!nextUser.user.premium) {
        Alert.alert(
          'Problem restoring Drippy Pro',
          'There was an issue restoring your Drippy Pro. '
          + 'It might be an issue with your connection, or no past purchase was found.',
          [
            {
              text: 'OK',
            },
          ],
        );
      } else if (nextUser.user.premium) {
        Alert.alert(
          'Drippy Pro Restored',
          'Thanks for your continued support as a Drippy Pro user!',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({
                  premium: true
                });
              }
            },
          ],
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.purchaseUpdatePro) {
      this.purchaseUpdatePro.remove();
      this.purchaseUpdatePro = null;
    }
    if (this.purchaseErrorPro) {
      this.purchaseErrorPro.remove();
      this.purchaseErrorPro = null;
    }
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
    const {
      getDefaultRecipes, deleteDefaultRecipes, changeTemperatureUnits, navigation,
      buyDrippyPro, restoreDrippyPro
    } = this.props;
    const { username, useMetric } = this.state;

    if (item === OPTION_GET_DRIPPY_PRO) {
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
    } else if (item === OPTION_RESTORE_PURCHASE) {
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
    } else if (item === OPTION_NAME) {
      // Bring up builder modal with name field prepopulated
      this.setState({
        visibleModal: true,
        modalText: username
      });
    } else if (item === OPTION_TEMP_UNITS) {
      // Prompt if they want to toggle temp unit
      let newUnit = 'Celsius';
      if (useMetric) {
        newUnit = 'Fahrenheit';
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
    } else if (item === OPTION_REPLAY_TUTORIAL) {
      // Pull up tutorial, pass in flag
      navigation.navigate({
        routeName: 'Tutorial',
        params: {
          fromSettings: true,
        },
        key: 'fromSettings'
      });
    } else if (item === OPTION_HIDE_DEFAULT) {
      // Prompt if they want to hide default recipes
      Alert.alert(
        'Are you sure?',
        'Do you want to hide the default recipes? This will remove them from your library, and any edits you made will be lost.',
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Hide',
            onPress: () => {
              deleteDefaultRecipes();
            }
          },
        ],
      );
    } else if (item === OPTION_RESTORE_DEFAULT) {
      // Prompt if they want to reset default recipes
      Alert.alert(
        'Are you sure?',
        "Do you want to restore the default recipes? This will bring back any that have been deleted and undo any edits you've made to them.",
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Restore',
            onPress: () => {
              getDefaultRecipes(true);
            }
          },
        ],
      );
    }
  }

  onCloseClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false,
      modalText: '',
    });
  }

  onChangeText = (text) => {
    this.setState({
      modalText: text
    });
  }

  onModalSave = () => {
    const { persistUsername } = this.props;
    const { modalText } = this.state;

    // Dismiss keyboard for modal
    Keyboard.dismiss();

    if (modalText === '') {
      Alert.alert(
        'Enter Name',
        'You need to enter a name. You do have a name, right?',
        [
          {
            text: 'OK',
          },
        ],
      );
      return;
    }

    // Call redux action to update name
    persistUsername(modalText, false);
  }

  renderSettingCard = (idx, setting) => {
    const { selected, premium } = this.state;

    let descriptionToUse = '';
    let optionsToUse = [];
    if (setting === SETTINGS_PRO && premium) {
      descriptionToUse = settingsDescriptions[SETTINGS_PRO_EXISTS];
      optionsToUse = settingsOptions[SETTINGS_PRO_EXISTS];
    } else {
      descriptionToUse = settingsDescriptions[setting];
      optionsToUse = settingsOptions[setting];
    }

    return (
      <SettingsCard
        key={idx}
        idx={idx}
        type={setting}
        description={descriptionToUse}
        options={optionsToUse}
        selected={selected[idx]}
        onCardClick={this.onCardClick}
        onPressItem={this.onPressItem}
      />
    );
  }

  render() {
    const { visibleModal, modalText } = this.state;
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
        <BuilderModal
          visibleModal={visibleModal}
          modalType={USER_NAME_ELEM}
          modalText={modalText}
          onCloseClick={this.onCloseClick}
          onChangeText={this.onChangeText}
          onModalSave={this.onModalSave}
        />
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

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes,
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  getDefaultRecipes: fetchDefaultRecipes,
  deleteDefaultRecipes: hideDefaultRecipes,
  persistUsername: saveUsername,
  changeTemperatureUnits: updateTemperatureUnits,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
  upgradeDrippyPro: upgradeIAP
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
