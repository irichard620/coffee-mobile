
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Pagination from '../../components/pagination';
import Button from '../../components/button';

class TutorialPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  onNextClick = () => {
    const { navigation } = this.props;
    const fromSettings = navigation.getParam('fromSettings', false);
    if (fromSettings) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }

  onSnapToItem = (idx) => {
    this.setState({ step: idx });
  }

  renderItem = ({ item }) => {
    const basePath = '../../assets/tutorial/';

    const { height } = Dimensions.get('window');
    const imageHeight = {
      height: height * 0.42
    };
    const imageContainerHeight = {
      marginTop: height * 0.148,
      height: height * 0.42
    };

    return (
      <View style={styles.carouselOutlineInner}>
        <View>
          <View style={[styles.iconContainer, imageContainerHeight]}>
            {item.step === 0 && <Image style={[styles.icon, imageHeight]} source={require(`${basePath}Tutorial_1.png`)} />}
            {item.step === 1 && <Image style={[styles.icon, imageHeight]} source={require(`${basePath}Tutorial_2.png`)} />}
            {item.step === 2 && <Image style={[styles.icon, imageHeight]} source={require(`${basePath}Tutorial_3.png`)} />}
            {item.step === 3 && <Image style={[styles.icon, imageHeight]} source={require(`${basePath}Tutorial_4.png`)} />}
          </View>
          <View style={styles.textview}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
        {item.button && (
        <View style={styles.buttonContainer}>
          <Button
            onButtonClick={this.onNextClick}
            type={1}
            title="Let's Go!"
            width={110}
            margin={[0, 0, 0, 0]}
          />
        </View>
        )}
      </View>
    );
  }

  render() {
    const { step } = this.state;

    // Get data
    const data = [
      {
        title: 'Welcome to Drippy',
        description: "Ready to make some great coffee? It's easy -- here's all you need to know.",
        step: 0,
        button: false
      },
      {
        title: 'Coffee Spotlight',
        description: 'Drippy helps you discover the hottest roasters and cafes around. '
          + "See where they're located, learn about their beans, and try their recipes yourself. "
          + 'Brew like the best!',
        step: 1,
        button: false
      },
      {
        title: 'Recipe Cards',
        description: 'Each recipe has its own card on your dashboard. Tap to expand, see more details '
          + 'and start the step-by-step brew guide.',
        step: 2,
        button: false
      },
      {
        title: 'Brew and Discover',
        description: "There's so much good coffee out there waiting for you -- and it's not going to brew itself.",
        step: 3,
        button: true
      }
    ];

    // Width, height
    const { width, height } = Dimensions.get('window');
    const carouselHeight = {
      height: height * 0.85
    };

    // switch to using carousel with new images
    return (
      <View style={styles.container}>
        <View style={[styles.carouselOutline, carouselHeight]}>
          <Carousel
            data={data}
            renderItem={this.renderItem}
            sliderWidth={width}
            itemWidth={width}
            hasParallaxImages={false}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            loop={false}
            autoplay={false}
            onSnapToItem={snapIdx => this.onSnapToItem(snapIdx)}
          />
        </View>
        <Pagination
          total={4}
          index={step}
          activeColor="#1D5E9E"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  showview: {
    position: 'absolute',
    top: '10%',
  },
  textview: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D5E9E',
    textAlign: 'center'
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center'
  },
  buttonview: {
    position: 'absolute',
    top: '80%',
    width: 40,
  },
  carouselOutline: {
    width: '100%'
  },
  carouselOutlineInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  icon: {
    resizeMode: 'contain',
    width: '100%'
  }
});

export default TutorialPage;
