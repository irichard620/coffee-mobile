
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, StyleSheet, LayoutAnimation, Linking, Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { fetchSponsor } from '../../actions/sponsor-actions';
import { sponsorRecipeAnalytics } from '../../actions/analytics-actions';
import Entry from '../home/entry';
import Back from '../../components/back';
import Sponsor from '../home/sponsor';
import * as constants from '../../constants';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';
import CustomModal from '../../components/modal';
import ModalContentCenter from '../../components/modal-content-center';
import {
  requestPurchaseIAP, restoreIAP
} from '../../actions/user-actions';

const camelcaseKeys = require('camelcase-keys');

class SponsorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBeans: [],
      selectedRecipes: [],
      beans: [],
      recipes: [],
      selectedMap: false,
      visibleModal: false,
      premium: false
    };
  }

  componentDidMount() {
    const { navigation, getSponsor, sponsors } = this.props;
    const sponsorIdNav = navigation.getParam('sponsor', {}).sponsorId;
    const premium = navigation.getParam('premium', false);

    let setState = false;
    if (sponsors && Object.getOwnPropertyNames(sponsors.sponsor).length !== 0) {
      const { sponsorId, beans, recipes } = sponsors.sponsor;
      if (sponsorId !== sponsorIdNav) {
        // Only reload if not cached
        getSponsor(sponsorIdNav);
      } else {
        setState = true;
        this.addBeansAndRecipesToState(beans, recipes, premium);
      }
    } else {
      getSponsor(sponsorIdNav);
    }
    if (!setState) {
      this.setState({ premium });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sponsors, recipes, user } = this.props;
    const nextSponsors = nextProps.sponsors;
    const nextRecipes = nextProps.recipes;
    const nextUser = nextProps.user;

    if (sponsors && sponsors.sponsorIsFetching && !nextSponsors.sponsorIsFetching) {
      if (nextSponsors.error !== '') {
        // Show alert
        Alert.alert(
          'Error Occurred',
          'Could not fetch featured beans/recipes from server.',
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
      if (nextRecipes.error !== '') {
        this.setState({ visibleModal: true });
      } else {
        // Tell user it was saved
        Alert.alert(
          'Recipe Added',
          'The recipe has been added to your library. Visit your dashboard to start brewing!',
          [
            {
              text: 'OK'
            },
          ],
        );
      }
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

  addBeansAndRecipesToState = (nextBeans, nextSponsorRecipes, premium) => {
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
      premium
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
    const { selectedRecipes, selectedMap } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    if (idx === -1) {
      this.setState({ selectedMap: !selectedMap });
    } else {
      this.setState({
        selectedRecipes: selectedRecipes.map((val, i) => (i === idx ? !val : false))
      });
    }
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
          'Error Occurred',
          'The URL could not be opened.',
          [
            {
              text: 'OK'
            },
          ],
        );
      }
    });
  }

  onMapClick = () => {
    Alert.alert(
      'Open Maps',
      'Do you want to open this location in maps?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Open',
          onPress: () => {
            this.openMaps();
          }
        },
      ],
    );
  }

  openMaps = () => {
    const { navigation } = this.props;
    const sponsor = navigation.getParam('sponsor', {});
    const sponsorLocation = sponsor.location ? sponsor.location : '';
    const sponsorStreetAddress = sponsor.streetAddress ? sponsor.streetAddress : 'Missing street address';
    const daddr = encodeURIComponent(`${sponsorStreetAddress}, ${sponsorLocation}`);

    let urlToUse = '';
    if (Platform.OS === 'ios') {
      urlToUse = `http://maps.apple.com/?daddr=${daddr}`;
    } else {
      urlToUse = `http://maps.google.com/?daddr=${daddr}`;
    }

    Linking.canOpenURL(urlToUse).then((supported) => {
      if (supported) {
        Linking.openURL(urlToUse);
      } else {
        // Open error alert
        Alert.alert(
          'Error Occurred',
          'The address could not be opened.',
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
    const { recipes, premium } = this.state;

    // Get our recipe
    const recipe = recipes[idx];

    // Analytics
    sponsorRecipeAnalytics(recipe.recipeId, recipe.recipeName,
      recipe.brewingVessel, recipe.sponsorId);

    persistRecipe(recipeModel.Recipe(recipe), premium);
  }

  onCloseModalClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false
    });
  }

  alertBuyDrippyPro = () => {
    const { buyDrippyPro } = this.props;
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
            this.setState({
              visibleModal: false
            });
          }
        },
      ],
    );
  }

  alertRestoreDrippyPro = () => {
    const { restoreDrippyPro } = this.props;
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
            this.setState({
              visibleModal: false
            });
          }
        },
      ],
    );
  }

  render() {
    const { navigation } = this.props;
    const {
      beans, recipes, selectedRecipes, selectedMap, visibleModal
    } = this.state;

    const sponsor = navigation.getParam('sponsor', {});

    const sponsorCompany = sponsor.company ? sponsor.company : '';
    const sponsorLocation = sponsor.location ? sponsor.location : '';
    const sponsorImage = sponsor.imageLink ? sponsor.imageLink : '';
    const sponsorTextColor = sponsor.textColor ? sponsor.textColor : '#F46F69';
    const sponsorHasAddress = sponsor.hasAddress ? sponsor.hasAddress : false;
    const sponsorVisitDescription = sponsor.visitDescription ? sponsor.visitDescription : `the ${sponsorCompany}`;
    const sponsorStreetAddress = sponsor.streetAddress ? sponsor.streetAddress : 'Missing street address';
    const sponsorLatitude = sponsor.latitude ? sponsor.latitude : 37.78825;
    const sponsorLongitude = sponsor.longitude ? sponsor.longitude : -122.4324;

    const sponsorObj = {};
    sponsorObj.description = `${sponsorCompany} \u2022 ${sponsorLocation}`;
    sponsorObj.imageLink = sponsorImage;
    sponsorObj.textColor = sponsorTextColor;
    sponsorObj.disabled = true;

    // Temp units
    const useMetric = navigation.getParam('useMetric', false);

    return (
      <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.outerContainer}>
        <ScrollView style={styles.container}>
          <View style={[styles.backcontainer]}>
            <Back
              onBackClick={this.onBackClick}
              type={0}
            />
          </View>
          <Sponsor
            sponsor={sponsorObj}
            type={1}
          />
          <View style={styles.separator} />
          {sponsorHasAddress && (
          <Entry
            idx={-1}
            selected={selectedMap}
            disabled={false}
            title={`Visit ${sponsorVisitDescription}`}
            description={`${sponsorStreetAddress}\n${sponsorLocation}`}
            isMap
            latitude={sponsorLatitude}
            longitude={sponsorLongitude}
            onEntryClick={this.onEntryClick}
            onMapClick={this.onMapClick}
          />
          )}
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
                vessel={recipe.brewingVessel}
                title={recipe.recipeName}
                description={recipeModel.getRecipeDescription(recipe, useMetric)}
                onEntryClick={this.onEntryClick}
                isSponsor
                onDownloadClick={this.onDownloadClick}
              />
            ))}
          </View>
          <CustomModal
            visibleModal={visibleModal}
            onCloseClick={this.onCloseModalClick}
            type={constants.MODAL_TYPE_CENTER}
          >
            <ModalContentCenter
              title={constants.POPUP_TITLE_DRIPPY_PRO_LIBRARY}
              description={constants.POPUP_DESCRIPTION_DRIPPY_PRO}
              type={0}
              primaryButtonTitle="Get Drippy Pro"
              secondaryButtonTitle="Restore Previous Purchase"
              onCloseClick={this.onCloseModalClick}
              onPrimaryButtonClick={this.alertBuyDrippyPro}
              onSecondaryButtonClick={this.alertRestoreDrippyPro}
            />
          </CustomModal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
    paddingTop: 8
  },
  backcontainer: {
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  separator: {
    height: 15
  },
  entrycontainer: {
    marginBottom: 45
  }
});

const mapStateToProps = state => ({
  user: state.userReducer.user,
  sponsors: state.sponsorsReducer.sponsors,
  recipes: state.recipesReducer.recipes,
});

const mapDispatchToProps = {
  getSponsor: fetchSponsor,
  persistRecipe: saveRecipe,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
};

export default connect(mapStateToProps, mapDispatchToProps)(SponsorPage);
