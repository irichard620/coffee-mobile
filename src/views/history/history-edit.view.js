
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import ButtonLarge from '../../components/button-large';
import BrewContentComplete from '../brew/brew-content-complete';
import { saveHistory } from '../../actions/history-actions';
import TopHeader from '../../components/top-header';

class HistoryEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numStars: 0,
      beansText: '',
      notesText: '',
      recipeName: '',
      history: {}
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const history = navigation.getParam('history', {});
    // Get attributes to pre-fill
    this.setState({
      history,
      recipeName: history.recipeName,
      numStars: history.stars,
      beansText: history.beans,
      notesText: history.notes,

    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      histories
    } = this.props;

    const nextHistories = nextProps.histories;
    if (histories && histories.historyIsSaving && !nextHistories.historyIsSaving) {
      this.onBackScreenClick();
    }
  }

  onFirstButtonClick = () => {
    const {
      history, numStars, beansText, notesText
    } = this.state;

    // Save brew history
    const { persistHistory } = this.props;
    const objToUse = history;
    objToUse.stars = numStars;
    objToUse.beans = beansText;
    objToUse.notes = notesText;
    persistHistory(objToUse);
  };

  onBackScreenClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onChangeText = (text, isBeans) => {
    if (isBeans) {
      this.setState({
        beansText: text
      });
    } else {
      this.setState({
        notesText: text
      });
    }
  };

  onStarClicked = (starNum) => {
    const { numStars } = this.state;
    let starToUse = starNum;
    if (starNum === 1 && numStars === 1) {
      starToUse = 0;
    }
    this.setState({
      numStars: starToUse
    });
  };

  render() {
    const {
      recipeName, numStars, beansText, notesText
    } = this.state;

    // Icon view styles
    const { width } = Dimensions.get('window');
    const largeButtonWidth = (width - 16 - 16);

    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={[styles.container]}>
          <TopHeader
            title={recipeName}
            onClose={this.onBackScreenClick}
            showSeparator={false}
            useArrow
          />
          <BrewContentComplete
            numStars={numStars}
            beansText={beansText}
            notesText={notesText}
            onChangeText={this.onChangeText}
            onStarClicked={this.onStarClicked}
          />
          <View style={styles.gradientContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#ffffff00']}
              style={styles.linearGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
          </View>
          <View style={styles.buttonView}>
            <ButtonLarge
              onButtonClick={this.onFirstButtonClick}
              title="Save to Brew History"
              margin={[0, 0, 0, 0]}
              buttonWidth={largeButtonWidth}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientContainer: {
    marginTop: -24,
    height: 24,
    backgroundColor: 'transparent',
    width: '100%'
  },
  linearGradient: {
    flex: 1,
  },
  buttonView: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 16
  },
});

const mapStateToProps = state => ({
  histories: state.historiesReducer.histories,
});

const mapDispatchToProps = {
  persistHistory: saveHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryEditPage);
