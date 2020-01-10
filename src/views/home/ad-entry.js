
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions
} from 'react-native';
import Button from '../../components/button';

export default function AdEntry(props) {
  const {
    title, description, onClose, onAdClicked,
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  const { width } = Dimensions.get('window');
  const titleWidth = {
    width: width - 32 - 32 - 48
  };

  return (
    <View style={styles.outline}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Image style={styles.close} source={require(`${baseButtonPath}Dashboard_Notice_X.png`)} />
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.adButtonView}>
        <Button
          onButtonClick={() => onAdClicked()}
          type={2}
          title="Get Drippy Pro"
          margin={[0, 0, 0, 0]}
          transparentColor="#2D8CD3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderRadius: 20,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 0,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    backgroundColor: '#DBF0FF',
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%'
  },
  title: {
    color: '#2D8CD3',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 16,
    width: '33%',
  },
  description: {
    color: '#2D8CD3',
    fontSize: 14,
    lineHeight: 16
  },
  adButtonView: {
    marginTop: 16,
    alignItems: 'center'
  },
  close: {
    height: 13,
    width: 13,
  }
});
