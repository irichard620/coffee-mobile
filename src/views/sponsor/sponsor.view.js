
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { fetchSponsor } from '../../actions/sponsor-actions';
import Entry from '../home/entry';

class SponsorPage extends Component {
	constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const sponsorId = navigation.getParam('sponsorId', 'NO-ID');
    this.props.getSponsor(sponsorId);
	}

	render() {
    const { sponsors } = this.props
    console.log(sponsors)
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
        {sponsorBeans.map((bean) => <Entry
          title={bean.title}
          key={bean._id}
          description={bean.description}
        />)}
        {sponsorRecipes.map((recipe) => <Entry
          title={recipe.title}
          key={recipe._id}
          description={'Insert generic recipe here'}
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
    alignSelf: 'flex-start'
  },
  location: {
    color: '#FFFFFF',
    fontSize: 20,
    alignSelf: 'flex-start'
  }
});

const mapStateToProps = (state) => ({ sponsors: state.sponsorsReducer.sponsors })

const mapDispatchToProps = { getSponsor: fetchSponsor }

SponsorPage = connect(mapStateToProps,mapDispatchToProps)(SponsorPage)

export default SponsorPage;
