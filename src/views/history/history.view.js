
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, StyleSheet, Alert, LayoutAnimation
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  fetchHistories, deleteHistory
} from '../../actions/history-actions';
import TopHeader from '../../components/top-header';
import HistoryEntry from './history-entry';
import * as constants from '../../constants';

class HistoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      histories: [],
      selected: [],
      historyIsFetched: false,
      historyIsDeleting: false,
      historyIsSaving: false,
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

    if (nextHistories && !prevState.historyIsDeleting && nextHistories.historyIsDeleting) {
      return {
        historyIsDeleting: true
      };
    } if (nextHistories && !prevState.historyIsSaving && nextHistories.historyIsSaving) {
      return {
        historyIsSaving: true
      };
    } if (nextHistories && !prevState.historyIsFetched && !nextHistories.historyIsFetching) {
      const newSelected = [];
      for (let i = 0; i < nextHistories.histories.length; i += 1) {
        newSelected.push(false);
      }
      return {
        selected: newSelected,
        histories: nextHistories.histories,
        historyIsFetched: true
      };
    } if (nextHistories && prevState.historyIsDeleting && !nextHistories.historyIsDeleting) {
      // Re-render from histories
      const newSelected = [];
      for (let i = 0; i < nextHistories.histories.length; i += 1) {
        newSelected.push(false);
      }
      return {
        selected: newSelected,
        histories: nextHistories.histories,
        historyIsDeleting: false
      };
    } if (nextHistories && prevState.historyIsSaving && !nextHistories.historyIsSaving) {
      // Re-render from histories
      const newSelected = [];
      for (let i = 0; i < nextHistories.histories.length; i += 1) {
        newSelected.push(false);
      }
      return {
        selected: newSelected,
        histories: nextHistories.histories,
        historyIsSaving: false
      };
    }
    return null;
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  onEntryClick = (idx) => {
    const { selected } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
    this.setState({
      selected: selected.map((val, i) => (i === idx ? !val : false))
    });
  };

  onDeleteClick = (historyId) => {
    const { deleteHistoryById } = this.props;
    Alert.alert(
      'Are you sure?',
      'Do you want to remove this brew history entry? There will be now way to recover it.',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteHistoryById(historyId);
          }
        },
      ],
    );
  };

  onEditClick = (idx) => {
    // Open edit view with this history item
    const { navigation } = this.props;
    const { histories } = this.state;
    navigation.navigate('HistoryEdit', {
      history: histories[idx]
    });
  };

  renderHistory = (history, idx, hasRecipe) => {
    const { selected } = this.state;
    return (
      <HistoryEntry
        key={`entry${idx}`}
        history={history}
        index={idx}
        hasRecipe={hasRecipe}
        selected={selected[idx]}
        onEntryClick={this.onEntryClick}
        onDeleteClick={this.onDeleteClick}
        onEditClick={this.onEditClick}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { histories } = this.state;

    const recipe = navigation.getParam('recipe', {});
    const useArrow = navigation.getParam('useArrow', false);
    const { recipeName } = recipe;
    const headerTitle = recipeName || 'Brew Journal';

    return (
      <View style={styles.container}>
        <TopHeader
          title={headerTitle}
          onClose={this.onBackClick}
          showSeparator
          useArrow={useArrow}
        />
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
  deleteHistoryById: deleteHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage);
