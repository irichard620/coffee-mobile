
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback
} from 'react-native';
import Button from '../../components/button';

export default function Bean(props) {
  const {
    title, description, beanImageLink, selected, onBeanClick, onExploreClick, idx
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  const textviewDynamic = {};
  let titleMargin = 0;
  if (selected) {
    textviewDynamic.flexDirection = 'column';
    textviewDynamic.flex = 1;
    titleMargin = 10;
  } else {
    textviewDynamic.justifyContent = 'center';
  }

  const titleAdditional = {
    marginBottom: titleMargin,
  };
  return (
    <TouchableWithoutFeedback onPress={() => onBeanClick(idx)}>
      <View style={styles.outline}>
        <Image style={styles.image} source={{ uri: beanImageLink }} />
        <View style={textviewDynamic}>
          <Text key={idx} style={[styles.title, titleAdditional]}>{title}</Text>
          {selected && <Text style={styles.description}>{description}</Text>}
        </View>
        {selected && (
        <View style={styles.buttonview}>
          <Image style={styles.close} source={require(`${baseButtonPath}Close.png`)} />
          <Button
            onButtonClick={() => onExploreClick(idx)}
            type={0}
            title="Explore the coffee"
            width="56%"
            margin={[0, 0, 0, 0]}
          />
        </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderRadius: 20,
    width: '90%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    backgroundColor: '#FFFFFF'
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    color: '#1D5E9E',
    fontSize: 18,
    fontWeight: '600',
    justifyContent: 'center',
  },
  description: {
    color: '#727272',
    fontSize: 14,
  },
  buttonview: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  close: {
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
    justifyContent: 'flex-start'
  },
});
