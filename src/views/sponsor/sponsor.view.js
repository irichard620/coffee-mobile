
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, ScrollView, StyleSheet, LayoutAnimation, Linking,
  ImageBackground, Image, Dimensions, Alert
} from 'react-native';
import { fetchSponsor } from '../../actions/sponsor-actions';
import Entry from '../home/entry';
import Back from '../../components/back';
import Bean from './bean';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';

const camelcaseKeys = require('camelcase-keys');

const CustomLayoutSpring = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
  },
};

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
    const sponsorIdNav = navigation.getParam('sponsorId', 'NO-ID');
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

    if (sponsors && sponsors.sponsorIsFetching && !nextSponsors.sponsorIsFetching
      && Object.getOwnPropertyNames(nextSponsors.sponsor).length !== 0) {
      this.addBeansAndRecipesToState(nextSponsors.sponsor.beans, nextSponsors.sponsor.recipes);
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

    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({ selectedBeans: selectedBeans.map((val, i) => (i === idx ? !val : false)) });
  }

  onEntryClick = (idx) => {
    const { selectedRecipes } = this.state;

    LayoutAnimation.configureNext(CustomLayoutSpring);
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

    persistRecipe(recipeModel.Recipe(recipe));
  }

  render() {
    const { sponsors } = this.props;
    const {
      beans, recipes, selectedBeans, selectedRecipes
    } = this.state;

    let sponsorTitle = 'Loading Sponsor...';
    let sponsorLocation = '';
    let sponsorBackImage = '';
    let sponsorLogoImage = '';
    if (sponsors && !sponsors.sponsorIsFetching
      && Object.getOwnPropertyNames(sponsors.sponsor).length === 0) {
      sponsorTitle = 'No Sponsors to show';
    } else if (sponsors && !sponsors.sponsorIsFetching
      && Object.getOwnPropertyNames(sponsors.sponsor).length !== 0) {
      sponsorTitle = sponsors.sponsor.company;
      sponsorLocation = sponsors.sponsor.location;
      sponsorBackImage = sponsors.sponsor.backgroundLink;
      sponsorLogoImage = sponsors.sponsor.logoLink;
    }

    const { height } = Dimensions.get('window');
    const headerHeight = {
      height: height * 0.38
    };

    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={{ uri: sponsorBackImage }} style={[styles.header, headerHeight]}>
          <View style={styles.backcontainer}>
            <Back
              onBackClick={this.onBackClick}
              type={1}
            />
          </View>
          <Image style={styles.logo} source={{ uri: sponsorLogoImage }} />
          <View style={styles.about}>
            <Text style={styles.company}>{sponsorTitle}</Text>
            <Text style={styles.location}>{sponsorLocation}</Text>
          </View>
        </ImageBackground>
        {beans.map((bean, idx) => (
          <Bean
            title={bean.title}
            key={bean.beanId}
            description={bean.description}
            beanImageLink={bean.imageLink}
            selected={selectedBeans[idx]}
            onBeanClick={this.onBeanClick}
            onExploreClick={this.onExploreClick}
            idx={idx}
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4'
  },
  header: {
    flex: 1,
    height: 352,
    width: '100%',
    marginBottom: 15,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  backcontainer: {
    marginTop: 60,
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  logo: {
    height: '24%',
    width: '75%',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    alignSelf: 'center'
  },
  about: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16
  },
  company: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'flex-start'
  },
  location: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'flex-start'
  }
});

const mapStateToProps = state => ({
  sponsors: state.sponsorsReducer.sponsors,
  recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { getSponsor: fetchSponsor, persistRecipe: saveRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(SponsorPage);
