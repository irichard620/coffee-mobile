
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableHighlight } from 'react-native';
import Step from './step';

class SwipeListItem extends Component {
	constructor(props) {
    super(props);

    this.gestureDelay = 35;
    this.scrollViewEnabled = true;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -35) {
          this.setScrollViewEnabled(false);
          let newX = gestureState.dx + this.gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > -150) {
          Animated.timing(this.state.position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            this.setScrollViewEnabled(true);
          });
        } else {
          Animated.timing(this.state.position, {
            toValue: {x: -175, y: 0},
            duration: 300,
          }).start(() => {
            this.setScrollViewEnabled(true);
          });
        }
      },
    });

    this.panResponder = panResponder;
    this.state = {position};
  }

  setScrollViewEnabled = (enabled) => {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }

	render() {
		const { id, title, description, type, canEdit } = this.props;

    return (
      <View style={styles.listItem}>
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.innerCell}>
            <Step
              id={id}
              disabled={true}
              title={title}
              description={description}
              margin={[0, 15, 0, 15]}
            />
          </View>
          <TouchableHighlight onPress={() => this.props.onPressEdit(id, type)} disabled={!canEdit} style={styles.absoluteCell1}>
            <Text style={styles.title}>...</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.onPressDelete(id)} disabled={false} style={styles.absoluteCell2}>
            <Text style={styles.title}>X</Text>
          </TouchableHighlight>
        </Animated.View>
      </View>
  );
	}
}

const styles = StyleSheet.create({
  listItem: {
    marginRight: -175,
    marginBottom: 15,
  },
  innerCell: {
    width: Dimensions.get('window').width,
    marginRight: 65,
  },
  outerCell: {
    marginBottom: 15,
    width: 175,
  },
  absoluteCell1: {
    position: 'absolute',
    backgroundColor: '#1D5E9E',
    borderRadius: 20,
    top: 0,
    bottom: 0,
    left: Dimensions.get('window').width + 15,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteCell2: {
    position: 'absolute',
    backgroundColor: '#E23131',
    borderRadius: 20,
    top: 0,
    bottom: 0,
    left: Dimensions.get('window').width + 95,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    alignSelf: 'center',
    zIndex: 10
  },
});

export default SwipeListItem;
