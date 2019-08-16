
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, ScrollView, StyleSheet, Dimensions, LayoutAnimation, Alert,
  Keyboard
} from 'react-native';
import {
  settings, settingsOptions, CustomLayoutSpring, settingsDescriptions, OPTION_NAME,
  OPTION_TEMP_UNITS, OPTION_HIDE_DEFAULT, OPTION_RESTORE_DEFAULT, USER_NAME_ELEM
} from '../../constants';
import Back from '../../components/back';
import SettingsCard from './settings-card';
import BuilderModal from '../builder/builder-modal';
import {
  fetchDefaultRecipes, hideDefaultRecipes
} from '../../actions/recipe-actions';
import { saveUsername, updateTemperatureUnits } from '../../actions/user-actions';

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [false, false, false],
      visibleModal: false,
      username: '',
      modalText: '',
      useMetric: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user && Object.keys(user.user).length !== 0 && ('name' in user.user)) {
      this.setState({
        username: user.user.name,
        useMetric: user.user.useMetric
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
          'Error occurred',
          'Could not reach Drippy server. Please try again later.',
          [
            {
              text: 'OK',
            },
          ],
        );
      } else {
        // Show success alert
        Alert.alert(
          'Success',
          'Default recipes were successfully restored.',
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
        'Success',
        'Default recipes were successfully hidden.',
        [
          {
            text: 'OK',
          },
        ],
      );
    } else if (user && user.userIsSaving && !nextUser.userIsSaving) {
      // Show success alert
      Alert.alert(
        'Success',
        'User settings successfully updated.',
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
    const { getDefaultRecipes, deleteDefaultRecipes, changeTemperatureUnits } = this.props;
    const { username, useMetric } = this.state;

    if (item === OPTION_NAME) {
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
        'Toggle Temperature Units',
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
    } else if (item === OPTION_HIDE_DEFAULT) {
      // Prompt if they want to hide default recipes
      Alert.alert(
        'Are you sure?',
        'Do you really want to hide default recipes? This will remove them from the homepage and reverse any edits you made on them.',
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
        'Do you really want to restore default recipes? This will bring back any you deleted and remove edits.',
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
        'Name Missing',
        'You must enter a name in the field.',
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
  changeTemperatureUnits: updateTemperatureUnits
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
