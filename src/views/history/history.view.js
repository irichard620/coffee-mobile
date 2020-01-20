
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, StyleSheet
} from 'react-native';
import {
  fetchHistories
} from '../../actions/history-actions';
import TopHeader from '../../components/top-header';
import HistoryEntry from './history-entry';

class HistoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      histories: [],
      selected: [],
      historyIsFetched: false,
    };
  }

  componentDidMount() {
    const { navigation, getHistories } = this.props;
    const recipe = navigation.getParam('recipe', {});
    const { recipeId } = recipe;
    getHistories(recipeId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextHistories = nextProps.histories;

    if (nextHistories && !prevState.historyIsFetched && !nextHistories.historyIsFetching) {
      const newSelected = [];
      for (let i = 0; i < nextHistories.histories.length; i += 1) {
        newSelected.push(false);
      }
      return {
        selected: newSelected,
        histories: nextHistories.histories,
        historyIsFetched: true
      };
    }
    return null;
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onEntryClick = (idx) => {
    const { selected } = this.state;

    this.setState({
      selected: selected.map((val, i) => (i === idx ? !val : false))
    });
  };

  // onDeleteClick = (idx) => {
  //
  // };

  renderHistory = (history, idx, hasRecipe) => {
    const { selected } = this.state;
    return (
      <HistoryEntry
        history={history}
        index={idx}
        hasRecipe={hasRecipe}
        selected={selected[idx]}
        onEntryClick={this.onEntryClick}
        onDeleteClick={this.onDeleteClick}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { histories } = this.state;

    const recipe = navigation.getParam('recipe', {});
    const { recipeName } = recipe;
    const headerTitle = recipeName || 'Brew Journal';

    return (
      <View style={styles.container}>
        <TopHeader title={headerTitle} onClose={this.onBackClick} showSeparator />
        <ScrollView style={styles.scrollContainer}>
          {histories.map((history, idx) => (
            this.renderHistory(history, idx, Object.keys(recipe).length > 0)
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
  },
});

const mapStateToProps = state => ({
  histories: state.historiesReducer.histories,
});

const mapDispatchToProps = {
  getHistories: fetchHistories,
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage);
