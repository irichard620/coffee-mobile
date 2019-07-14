
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback
} from 'react-native';
import Button from '../../components/button';
import * as constants from '../../constants';
import * as recipeModel from '../../storage/recipe';
import * as stepModel from '../../storage/step';
import { favoriteRecipe, unfavoriteRecipe, deleteRecipe } from '../../actions/recipe-actions';
import CustomModal from '../../components/modal';

class BrewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: -1,
      recipe: {},
      visibleModal: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', {});
    this.setState({ recipe });
  }

  componentWillReceiveProps(nextProps) {
    const { recipe } = this.state;
    const { recipes } = nextProps;

    if (recipes && !recipes.recipesIsFetching && !recipes.recipeIsSaving
      && !recipes.recipeIsDeleting && recipes.recipes.length !== 0) {
      for (let i = 0; i < recipes.recipes.length; i += 1) {
        // Check IDs and
        if (recipes.recipes[i].recipeId === recipe.recipeId) {
          this.setState({ recipe: recipes.recipes[i] });
        }
      }
    }
  }

  onCloseClick = () => {
    const { navigation } = this.props;

    navigation.goBack();
  }

  onBrewClick = () => {
    const { navigation } = this.props;
    const { step, recipe } = this.state;

    if (step !== recipe.steps.length) {
      this.setState({
        step: step + 1
      });
    } else {
      navigation.goBack();
    }
  }

  onEditClick = () => {
    this.setState({
      visibleModal: true
    });
  }

  onBackClick = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  }

  onCloseModalClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false
    });
  }

  onPressItem = (item) => {
    const { navigation } = this.props;
    const { recipe } = this.state;

    if (item === constants.RECIPE_MENU_EDIT) {
      navigation.navigate('Builder', {
        recipe
      });
    } else if (item === constants.RECIPE_MENU_FAVORITE) {
      // Call favorite recipe
      favoriteRecipe(recipe.recipeId);
    } else if (item === constants.RECIPE_MENU_UNFAVORITE) {
      // Call unfavorite recipe
      unfavoriteRecipe(recipe.recipeId);
    } else if (item === constants.RECIPE_MENU_DELETE) {
      // Call delete recipe
      deleteRecipe(recipe.recipeId);
      // Go back in navigation
      navigation.goBack();
    }
  }

  getModalOptions = () => {
    const { recipe } = this.state;

    const options = [{
      id: constants.RECIPE_MENU_EDIT,
      title: 'Edit recipe'
    }];

    if (recipe.favorited) {
      options.push({
        id: constants.RECIPE_MENU_UNFAVORITE,
        title: 'Unfavorite recipe'
      });
    } else {
      options.push({
        id: constants.RECIPE_MENU_FAVORITE,
        title: 'Favorite recipe'
      });
    }
    options.push({
      id: constants.RECIPE_MENU_DELETE,
      title: 'Delete'
    });
    return options;
  }

  getVesselIcon = (vesselId) => {
    const baseBrewPath = '../../assets/brew/';

    if (vesselId === constants.VESSEL_AEROPRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Aeropress_Vessel.png`)} />);
    } if (vesselId === constants.VESSEL_CHEMEX) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Chemex_Vessel.png`)} />);
    } if (vesselId === constants.VESSEL_FRENCH_PRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}FrenchPress_Vessel.png`)} />);
    }
    return (<Image style={styles.icon} source={require(`${baseBrewPath}V60_Vessel.png`)} />);
  }

  getIcon = (recipe) => {
    const { step } = this.state;

    const baseBrewPath = '../../assets/brew/';

    if (step === -1) {
      return this.getVesselIcon(recipe.vesselId);
    }
    if (step < recipe.steps.length) {
      // Get step
      const stepObj = recipe.steps[step];
      if (stepObj.type === constants.STEP_HEAT_WATER
        || stepObj.type === constants.STEP_BLOOM_GROUNDS
        || stepObj.type === constants.STEP_POUR_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}WaterKettle.png`)} />);
      }
      if (stepObj.type === constants.STEP_GRIND_COFFEE
        || stepObj.type === constants.STEP_ADD_GROUNDS) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}CoffeeBeans.png`)} />);
      }
      return this.getVesselIcon(recipe.vesselId);
    }
    // End image
    return (<Image style={styles.icon} source={require(`${baseBrewPath}Mug_DoneBrewing.png`)} />);
  }

  render() {
    const { step, visibleModal, recipe } = this.state;

    const baseButtonPath = '../../assets/buttons/';

    // Button styles
    let buttonMarginRight = 15;
    let buttonTitle = 'Brew';
    if (!('steps' in recipe)) {
      buttonTitle = 'Loading...';
    } else if (step >= 0 && step < recipe.steps.length) {
      buttonMarginRight = 0;
      buttonTitle = 'Next';
    } else if (step === recipe.steps.length) {
      buttonTitle = 'Finish';
    }
    const backStyle = {
      transform: [{ rotate: '180deg' }],
      marginRight: 15,
    };

    // Description
    let description = '';
    if (step === -1) {
      description = recipeModel.getRecipeDescription(recipe);
    } else if (step < recipe.steps.length) {
      description = stepModel.getStepDescription(recipe.steps[step]);
    } else {
      description = 'Enjoy your coffee!';
    }

    return (
      <View style={styles.transparentcontainer}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.onCloseClick}>
            <Image style={styles.close} source={require(`${baseButtonPath}Close.png`)} />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>{recipe.recipeName}</Text>
          <View style={styles.iconview}>
            {this.getIcon(recipe)}
          </View>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonview}>
            {step !== -1 && step !== recipe.steps.length
                && (
                  <TouchableWithoutFeedback onPress={this.onBackClick}>
                    <Image style={[styles.mini, backStyle]} source={require(`${baseButtonPath}Go.png`)} />
                  </TouchableWithoutFeedback>
                )}
            <Button
              onButtonClick={this.onBrewClick}
              type={0}
              title={buttonTitle}
              width={120}
              margin={[0, buttonMarginRight, 0, 0]}
            />
            {step === -1 && (
            <TouchableWithoutFeedback onPress={this.onEditClick}>
              <Image style={styles.mini} source={require(`${baseButtonPath}Edit.png`)} />
            </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        <CustomModal
          visibleModal={visibleModal}
          onCloseClick={this.onCloseModalClick}
          onPressItem={this.onPressItem}
          isListModal
          isSelectInput={false}
          options={this.getModalOptions()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transparentcontainer: {
    height: '100%',
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    marginTop: 25,
    marginBottom: 20,
    fontSize: 28,
    color: '#1D5E9E',
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  close: {
    alignSelf: 'flex-start',
    height: 25,
    width: 25,
  },
  iconview: {
    alignItems: 'center',
    height: '30%',
    marginTop: 30,
    marginBottom: 30,
  },
  icon: {
    height: '100%',
    resizeMode: 'contain'
  },
  description: {
    fontSize: 18,
    color: '#727272'
  },
  buttonview: {
    position: 'absolute',
    top: '80%',
    alignSelf: 'center',
    width: 175,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: '13%'
  },
  mini: {
    height: 40,
    width: 40
  }
});

const mapStateToProps = state => ({ recipes: state.recipesReducer.recipes });

const mapDispatchToProps = {
  favoriteRecipe,
  unfavoriteRecipe,
  deleteRecipe
};

export default connect(mapStateToProps, mapDispatchToProps)(BrewPage);
