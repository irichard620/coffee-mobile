import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Sponsor from './sponsor';
import Pagination from '../../components/pagination';

class SponsorCarousel extends Component {
  renderItem = ({ item }) => {
    const { onSponsorClick } = this.props;
    return (
      <Sponsor
        onSponsorClick={onSponsorClick}
        sponsor={item}
        type={0}
      />
    );
  }

  render() {
    const { sponsors, index, onSnapToItem } = this.props;

    // Get data
    let data = [];
    if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length !== 0) {
      data = sponsors.sponsors;
    } else if (!sponsors || !sponsors.sponsors) {
      data.push({ description: 'Could not load sponsors', disabled: true, themeColor: '#F46F69' });
    } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length === 0) {
      data.push({ description: 'No Sponsors to show', disabled: true, themeColor: '#F46F69' });
    } else {
      data.push({ description: 'Loading Sponsors', disabled: true, themeColor: '#F46F69' });
    }

    // Theme color at index
    const activeDotColor = data[index].themeColor;

    // Width
    const { width } = Dimensions.get('window');

    return (
      <View style={styles.outline}>
        <Carousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
          hasParallaxImages={false}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop
          loopClonesPerSide={2}
          autoplay
          autoplayDelay={6000}
          autoplayInterval={6000}
          enableMomentum={false}
          lockScrollWhileSnapping
          onSnapToItem={snapIdx => onSnapToItem(snapIdx)}
        />
        <Pagination
          total={data.length}
          index={index}
          activeColor={activeDotColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    marginBottom: 16
  },
  slider: {
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingTop: 8, // for custom animation
    paddingBottom: 3
  }
});

export default SponsorCarousel;
