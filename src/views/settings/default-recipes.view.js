import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Alert
} from 'react-native';
import { connect } from 'react-redux';
import TopHeader from '../../components/top-header';
import { fetchDefaultRecipes, hideDefaultRecipes } from '../../actions/recipe-actions';
import Detail from '../builder/detail';
import * as constants from '../../constants';

class DefaultRecipesPage extends Component {
  componentWillReceiveProps(nextProps) {
    const { recipes } = this.props;
    const nextRecipes = nextProps.recipes;

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
    }
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onOptionClicked = (option) => {
    const { getDefaultRecipes, deleteDefaultRecipes } = this.props;
    if (option === constants.DEFAULT_RECIPES_RESTORE) {
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
    } else if (option === constants.DEFAULT_RECIPES_HIDE) {
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
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TopHeader title="Default Recipes" onClose={this.onBackClick} showSeparator={false} useArrow />
        <Text style={styles.description}>
          {'Drippy comes with a number of default recipes to get you acquainted with each new '}
          {'coffee brewing method. Once in a while, we might update these recipes to improve them. '}
          {'Restoring the default recipes will update them with the latest versions. '}
          {'You can also hide them here if you would rather get rid of them completely.'}
        </Text>
        <View style={styles.separator} />
        <Detail
          title={constants.DEFAULT_RECIPES_RESTORE}
          modalId={constants.DEFAULT_RECIPES_RESTORE}
          onDetailClick={this.onOptionClicked}
          showArrow
          showSeparator
        />
        <Detail
          title={constants.DEFAULT_RECIPES_HIDE}
          modalId={constants.DEFAULT_RECIPES_HIDE}
          onDetailClick={this.onOptionClicked}
          showArrow
          showSeparator
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  description: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 16,
    color: '#898989',
    marginTop: 8,
    marginBottom: 16,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F3F6',
  }
});

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes,
});

const mapDispatchToProps = {
  getDefaultRecipes: fetchDefaultRecipes,
  deleteDefaultRecipes: hideDefaultRecipes,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultRecipesPage);
