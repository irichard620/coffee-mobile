
import React from 'react';
import {
  View, StyleSheet, Image, ScrollView, Text,
  TextInput
} from 'react-native';
import BrewStars from './brew-stars';

export default function BrewContentComplete(props) {
  const {
    numStars, beansText, notesText, onChangeText, onStarClicked
  } = props;

  const baseBrewPath = '../../assets/brew/';

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.iconView}>
        <Image style={styles.icon} source={require(`${baseBrewPath}Brew_BrewCompleteArt.png`)} />
      </View>
      <Text style={styles.headerText}>Brew Complete</Text>
      <Text style={styles.bodyText}>
        {'Rate your coffee and leave any notes below. '
        + 'Look back or edit these entries anytime from the Brew History tab.'}
      </Text>
      <View style={styles.topSeparator} />
      <Text style={styles.subHeader}>How was your coffee?</Text>
      <BrewStars numStars={numStars} onStarClicked={onStarClicked} />
      <Text style={styles.subHeader}>What coffee beans did you use?</Text>
      <TextInput
        onChangeText={text => onChangeText(text, true)}
        value={beansText}
        placeholder="Coffee Beans"
        placeholderTextColor="#898989"
        style={styles.textInput}
        maxLength={250}
        multiline={false}
      />
      <Text style={styles.subHeader}>Any notes about the recipe?</Text>
      <TextInput
        onChangeText={text => onChangeText(text, false)}
        value={notesText}
        placeholder="Recipe Notes"
        placeholderTextColor="#898989"
        style={styles.textInput}
        maxLength={2000}
        multiline
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  iconView: {
    width: '100%',
    maxWidth: 312,
    marginBottom: 12,
    alignSelf: 'center'
  },
  icon: {
    width: '100%',
    resizeMode: 'contain'
  },
  headerText: {
    fontSize: 22,
    color: '#1D5E9E',
    textAlign: 'center',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  topSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F3F6',
    marginTop: 24,
  },
  subHeader: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    marginTop: 24,
    marginBottom: 16
  },
  textInput: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F2F3F6',
    fontSize: 16,
  }
});
