
import React, { Component } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions
} from 'react-native';
import Back from '../../components/back';

class SettingsPage extends Component {
  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
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

export default SettingsPage;
