
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import { fetchSponsor } from '../../actions/sponsor-actions';
import Entry from '../home/entry';
import Bean from './bean';
import * as recipeModel from '../../storage/recipe';
const camelcaseKeys = require('camelcase-keys');

const CustomLayoutSpring = {
	duration: 400,
	create: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.scaleY,
		springDamping: 0.7,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		springDamping: 0.7,
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
		}
  }

  componentDidMount() {
    const { navigation } = this.props;
    const sponsorId = navigation.getParam('sponsorId', 'NO-ID');
    this.props.getSponsor(sponsorId);
	}

	componentWillReceiveProps(nextProps) {
	  const sponsors = nextProps.sponsors;

		newSelectedBeans = []
		newSelectedRecipes = []
		newBeans = []
		newRecipes = []

		if (sponsors && !sponsors.sponsorIsFetching && Object.getOwnPropertyNames(sponsors.sponsor).length != 0) {
			beans = sponsors.sponsor["beans"]
			recipes = sponsors.sponsor["recipes"]
			for (i = 0; i < beans.length; i++) {
				// Push to beans
				newSelectedBeans.push(false)
				newBeans.push(camelcaseKeys(beans[i]))
			}
			for (i = 0; i < recipes.length; i++) {
				// Push to recipes
				newSelectedRecipes.push(false)
				newRecipes.push(camelcaseKeys(recipes[i]))
			}
		}
		this.setState({
			selectedBeans: newSelectedBeans,
			beans: newBeans,
			selectedRecipes: newSelectedRecipes,
			recipes: newRecipes,
		});
	}

	onBeanClick = (idx) => {
		const { tab, selectedBeans } = this.state;

		LayoutAnimation.configureNext(CustomLayoutSpring);
		this.setState({selectedBeans: selectedBeans.map((val, i) => i === idx ? !val : false)})
	}

	onEntryClick = (idx) => {
		const { tab, selectedRecipes } = this.state;

		LayoutAnimation.configureNext(CustomLayoutSpring);
		this.setState({selectedRecipes: selectedRecipes.map((val, i) => i === idx ? !val : false)})
	}

	onExploreClick = (idx) => {

	}

	render() {
    const { sponsors } = this.props
		const { beans, recipes, selectedBeans, selectedRecipes } = this.state;
		
		let sponsorTitle = "Loading Sponsor..."
		let sponsorLocation = ""
    let sponsorBeans = []
    let sponsorRecipes = []
		if (sponsors && !sponsors.sponsorIsFetching && Object.getOwnPropertyNames(sponsors.sponsor).length == 0) {
			sponsorDescription = "No Sponsors to show"
		} else if (sponsors && !sponsors.sponsorIsFetching && Object.getOwnPropertyNames(sponsors.sponsor).length != 0) {
			sponsorTitle = sponsors.sponsor["company"]
			sponsorLocation = sponsors.sponsor["location"]
      sponsorBeans = sponsors.sponsor["beans"]
			sponsorRecipes = sponsors.sponsor["recipes"]
		}
		return (
			<ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.title}>Logo here</Text>
          </View>
          <View style={styles.about}>
            <Text style={styles.company}>{sponsorTitle}</Text>
            <Text style={styles.location}>{sponsorLocation}</Text>
          </View>
        </View>
        {beans.map((bean, idx) => <Bean
          title={bean.title}
          key={bean._id}
          description={bean.description}
					beanImageLink={bean.imageLink}
					selected={selectedBeans[idx]}
					onBeanClick={this.onBeanClick}
					onExploreClick={this.onExploreClick}
					idx={idx}
        />)}
        {recipes.map((recipe, idx) => <Entry
					key={recipe._id}
					idx={idx}
					selected={selectedRecipes[idx]}
					vesselId={recipe.vesselId}
					title={recipe.recipeName}
					description={recipeModel.getRecipeDescription(recipe)}
					onEntryClick={this.onEntryClick}
					onGoClick={this.onGoClick}
				/>)}
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
    backgroundColor: '#80694a',
    marginBottom: 15
  },
  logo: {
    height: '80%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    alignSelf: 'center'
  },
  about: {
    flex: 1,
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

const mapStateToProps = (state) => ({ sponsors: state.sponsorsReducer.sponsors })

const mapDispatchToProps = { getSponsor: fetchSponsor }

SponsorPage = connect(mapStateToProps,mapDispatchToProps)(SponsorPage)

export default SponsorPage;
