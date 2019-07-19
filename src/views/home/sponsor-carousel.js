import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Sponsor from './sponsor';

class SponsorCarousel extends Component {
  renderItem = ({ item, index }) => {
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
      data.push({ description: 'Could not load sponsors', disabled: true });
    } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length === 0) {
      data.push({ description: 'No Sponsors to show', disabled: true });
    }

    // Width
    const { width } = Dimensions.get('window');

    return (
      <View style={styles.outline}>
        <Carousel
          ref={c => this.sliderRef = c}
          data={data}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
          hasParallaxImages={false}
          firstItem={0}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={snapIdx => onSnapToItem(snapIdx)}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={index}
          containerStyle={styles.paginationContainer}
          dotColor="#F46F69"
          dotStyle={styles.activePaginationDot}
          inactiveDotStyle={styles.inactivePaginationDot}
          inactiveDotColor="#E3E3E3"
          inactiveDotOpacity={1}
          inactiveDotScale={1}
          carouselRef={this.sliderRef}
          tappableDots={!!this.sliderRef}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    marginBottom: 20
  },
  slider: {
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 5
  },
  activePaginationDot: {
    width: 15,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F46F69'
  },
  inactivePaginationDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  }
});

export default SponsorCarousel;
