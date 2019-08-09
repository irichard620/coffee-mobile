
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, StyleSheet, LayoutAnimation, Linking, Alert, Dimensions
} from 'react-native';
import { fetchSponsor } from '../../actions/sponsor-actions';
import { sponsorRecipeAnalytics } from '../../actions/analytics-actions';
import Entry from '../home/entry';
import Back from '../../components/back';
import Sponsor from '../home/sponsor';
import Map from './map';
import * as constants from '../../constants';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';

const camelcaseKeys = require('camelcase-keys');

class SponsorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBeans: [],
      selectedRecipes: [],
      beans: [],
      recipes: [],
    };
  }

  componentDidMount() {
    const { navigation, getSponsor, sponsors } = this.props;
    const sponsorIdNav = navigation.getParam('sponsor', {}).sponsorId;
    if (sponsors && Object.getOwnPropertyNames(sponsors.sponsor).length !== 0) {
      const { sponsorId, beans, recipes } = sponsors.sponsor;
      if (sponsorId !== sponsorIdNav) {
        // Only reload if not cached
        getSponsor(sponsorIdNav);
      } else {
        this.addBeansAndRecipesToState(beans, recipes);
      }
    } else {
      getSponsor(sponsorIdNav);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sponsors, recipes } = this.props;
    const nextSponsors = nextProps.sponsors;
    const nextRecipes = nextProps.recipes;

    if (sponsors && sponsors.sponsorIsFetching && !nextSponsors.sponsorIsFetching) {
      if (nextSponsors.error !== '') {
        // Show alert
        Alert.alert(
          'Error occurred',
          'Could not fetch sponsor beans/recipes from server.',
          [
            {
              text: 'OK'
            },
          ],
        );
      } else if (Object.getOwnPropertyNames(nextSponsors.sponsor).length !== 0) {
        this.addBeansAndRecipesToState(nextSponsors.sponsor.beans, nextSponsors.sponsor.recipes);
      }
    } else if (recipes && recipes.recipeIsSaving && !nextRecipes.recipeIsSaving) {
      // Tell user it was saved
      Alert.alert(
        'Recipe saved',
        `Recipe was successfully downloaded to your device.
        Go back to home page to use it`,
        [
          {
            text: 'OK'
          },
        ],
      );
    }
  }

  addBeansAndRecipesToState = (nextBeans, nextSponsorRecipes) => {
    const newSelectedBeans = [];
    const newSelectedRecipes = [];
    const newBeans = [];
    const newRecipes = [];

    for (let i = 0; i < nextBeans.length; i += 1) {
      // Push to beans
      newSelectedBeans.push(false);
      newBeans.push(camelcaseKeys(nextBeans[i]));
    }
    for (let i = 0; i < nextSponsorRecipes.length; i += 1) {
      // Push to recipes
      newSelectedRecipes.push(false);
      newRecipes.push(camelcaseKeys(nextSponsorRecipes[i]));
    }
    this.setState({
      selectedBeans: newSelectedBeans,
      beans: newBeans,
      selectedRecipes: newSelectedRecipes,
      recipes: newRecipes,
    });
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  onBeanClick = (idx) => {
    const { selectedBeans } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    this.setState({ selectedBeans: selectedBeans.map((val, i) => (i === idx ? !val : false)) });
  }

  onEntryClick = (idx) => {
    const { selectedRecipes } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    this.setState({ selectedRecipes: selectedRecipes.map((val, i) => (i === idx ? !val : false)) });
  }

  onExploreClick = (idx) => {
    // Open link
    const { beans } = this.state;

    // Get our specific bean link
    const url = beans[idx].beanLink;

    // Open
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Open error alert
        Alert.alert(
          'Error occurred',
          'Could not open url',
          [
            {
              text: 'OK'
            },
          ],
        );
      }
    });
  }

  onDownloadClick = (idx) => {
    const { persistRecipe } = this.props;
    const { recipes } = this.state;
    // Get our recipe
    const recipe = recipes[idx];

    // Analytics
    sponsorRecipeAnalytics(recipe.recipeId, recipe.recipeName,
      recipe.brewingVessel, recipe.sponsorId);

    persistRecipe(recipeModel.Recipe(recipe));
  }

  render() {
    const { navigation } = this.props;
    const {
      beans, recipes, selectedRecipes
    } = this.state;

    const sponsor = navigation.getParam('sponsor', {});

    const sponsorCompany = sponsor.company ? sponsor.company : '';
    const sponsorLocation = sponsor.location ? sponsor.location : '';
    const sponsorImage = sponsor.imageLink ? sponsor.imageLink : '';
    const sponsorTextColor = sponsor.textColor ? sponsor.textColor : '#F46F69';
    const sponsorThemeColor = sponsor.themeColor ? sponsor.themeColor : '#727272';
    const sponsorStreetAddress = sponsor.streetAddress ? sponsor.streetAddress : 'Missing street address';
    const sponsorLatitude = sponsor.latitude ? sponsor.latitude : 37.78825;
    const sponsorLongitude = sponsor.longitude ? sponsor.longitude : -122.4324;

    const sponsorObj = {};
    sponsorObj.description = `${sponsorCompany} \u2022 ${sponsorLocation}`;
    sponsorObj.imageLink = sponsorImage;
    sponsorObj.textColor = sponsorTextColor;
    sponsorObj.disabled = true;

    // Top margin - dynamic
    const { height } = Dimensions.get('window');
    const marginTopStyle = {
      marginTop: height * 0.03
    };

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.backcontainer, marginTopStyle]}>
          <Back
            onBackClick={this.onBackClick}
            type={0}
          />
        </View>
        <Sponsor
          sponsor={sponsorObj}
          type={1}
        />
        <Map
          latitude={sponsorLatitude}
          longitude={sponsorLongitude}
          fullAddress={`${sponsorStreetAddress}\n${sponsorLocation}`}
          themeColor={sponsorThemeColor}
        />
        <View style={styles.entrycontainer}>
          {beans.map((bean, idx) => (
            <Entry
              key={bean.beanId}
              idx={idx}
              selected
              disabled
              title={bean.title}
              description={bean.description}
              isBean
              onExploreClick={this.onExploreClick}
            />
          ))}
          {recipes.map((recipe, idx) => (
            <Entry
              key={recipe.recipeId}
              idx={idx}
              selected={selectedRecipes[idx]}
              vesselId={recipe.vesselId}
              title={recipe.recipeName}
              description={recipeModel.getRecipeDescription(recipe)}
              onEntryClick={this.onEntryClick}
              isSponsor
              onDownloadClick={this.onDownloadClick}
            />
          ))}
        </View>
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
  separator: {
    height: 15
  },
  entrycontainer: {
    marginBottom: 90
  }
});

const mapStateToProps = state => ({
  sponsors: state.sponsorsReducer.sponsors,
  recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { getSponsor: fetchSponsor, persistRecipe: saveRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(SponsorPage);
