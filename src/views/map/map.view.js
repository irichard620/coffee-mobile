
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Alert, Platform, Linking
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { fetchLocations } from '../../actions/location-actions';
import TopHeader from '../../components/top-header';

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      locations: [],
      bottomMargin: 1,
    };
  }

  componentDidMount() {
    const { getLocations, navigation } = this.props;

    // Get locations
    const sponsorID = navigation.getParam('sponsorID', '');
    getLocations(sponsorID);
  }

  componentWillReceiveProps(nextProps) {
    const { locations } = this.props;
    const nextLocations = nextProps.locations;

    // Check if restore default worked
    if (locations && locations.locationsIsFetching && !nextLocations.locationsIsFetching) {
      if (nextLocations.error !== '') {
        Alert.alert(
          'Error Occurred',
          'Could not fetch cafe locations from server.',
          [
            {
              text: 'OK'
            },
          ],
        );
      } else {
        const markerList = [];
        for (let i = 0; i < nextLocations.locations.length; i += 1) {
          markerList.push({
            latitude: nextLocations.locations[i].latitude,
            longitude: nextLocations.locations[i].longitude
          });
        }
        this.setState({
          locations: nextLocations.locations
        });
        const edgePadding = {
          top: 100,
          right: 50,
          bottom: 300,
          left: 50
        };
        this.mapRef.fitToCoordinates(markerList, { edgePadding, animated: false });
      }
    }
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onCalloutPress = (locationDescription) => {
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
            this.openMaps(locationDescription);
          }
        },
      ],
    );
  };

  openMaps = (locationDescription) => {
    const address = locationDescription || 'Missing street address';
    const encodedAddress = encodeURIComponent(address);

    let urlToUse = '';
    if (Platform.OS === 'ios') {
      urlToUse = `http://maps.apple.com/?daddr=${encodedAddress}`;
    } else {
      urlToUse = `http://maps.google.com/?daddr=${encodedAddress}`;
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
  };

  render() {
    const { navigation } = this.props;
    const { locations } = this.state;

    const useArrow = navigation.getParam('sponsorID', '') !== '';
    const sponsorCompany = navigation.getParam('sponsorCompany', 'Drippy');

    return (
      <View style={styles.container}>
        <TopHeader title={`${sponsorCompany} Map`} onClose={this.onBackClick} showSeparator={false} useArrow={useArrow} />
        <MapView
          ref={(ref) => { this.mapRef = ref; }}
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.7749,
            longitude: 122.4194,
            latitudeDelta: 0.15,
            longitudeDelta: 0.121
          }}
          showsUserLocation
          showsMyLocationButton
          onMapReady={() => this.setState({ bottomMargin: 0 })}
          pitchEnabled
          scrollEnabled
          rotateEnabled={false}
          zoomControlEnabled
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsTraffic={false}
        >
          {locations.map(location => (
            <Marker
              key={location.locationId}
              title={location.locationName || ''}
              description={location.locationDescription || ''}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              onCalloutPress={() => this.onCalloutPress(location.locationDescription)}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
});

const mapStateToProps = state => ({
  locations: state.locationsReducer.locations,
});

const mapDispatchToProps = {
  getLocations: fetchLocations,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
