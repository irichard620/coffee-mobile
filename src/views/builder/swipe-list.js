
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import * as constants from './builder-constants';
import Step from './step';

class SwipeList extends Component {
	constructor(props) {
    super(props);
  }

  renderItem = ({item}) => {
    return (<Step
      disabled={true}
      title={item['title']}
      description={item['description']}
    />);
  };

	render() {
		const { data } = this.props;

    return (
      <SwipeListView
        useFlatList
        data={data}
        renderItem={this.renderItem}
        renderHiddenItem={ (data, rowMap) => (
          <View style={styles.rowBack}>
            <Text>Left</Text>
            <Text>Right</Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
		);
	}
}

const styles = StyleSheet.create({
  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
});

export default SwipeList;
