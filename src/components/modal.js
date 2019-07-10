
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Picker, Button, Image,
  TouchableWithoutFeedback } from 'react-native';
import Modal from "react-native-modal";
import List from './list';
import Close from './close';
import * as constants from '../constants';
import ButtonMini from './button-mini';

class CustomModal extends Component {
	render() {
		const { visibleModal, modalId, modalText, textPlaceholder, modalSelect, onCloseClick,
      onSwipeComplete, onPressItem, onChangeText, onModalSave, onChangePicker, isListModal,
      isSelectInput, options, title, pickerValues } = this.props;

    const baseButtonPath = "../assets/buttons/";

    // Elems with atleast one text
    isTextInput = !isListModal
    isTitle = title != ""

		return (
      <Modal
        isVisible={visibleModal}
        onSwipeComplete={onCloseClick}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <View style={styles.content}>
          <View style={styles.buttonsContainer}>
            <TouchableWithoutFeedback onPress = {onCloseClick}>
              <Image style={styles.close} source={require(baseButtonPath + "Close.png")} />
            </TouchableWithoutFeedback>
            {!isListModal && <ButtonMini
  						onButtonClick={() => onModalSave(modalId)}
  						type={0}
  						title={'Save'}
  						width={70}
  						margin={[0, 0, 0, 0]}
  					/>}
          </View>
          {isTitle && <Text style={styles.title}>{title}</Text>}
          {isTextInput && <TextInput
            onChangeText={(text) => onChangeText(text)}
            value={modalText}
            placeholder={textPlaceholder}
            placeholderTextColor='#b7b3b3'
            style={styles.textinput}
          />}
          {isSelectInput && <View style={styles.picker}>
            <Picker
              selectedValue={modalSelect}
              onValueChange={onChangePicker}
              itemStyle={styles.pickertitle}
            >
              {pickerValues.map(pickerVal => (
                <Picker.Item label={pickerVal} value={pickerVal} />
              ))}
            </Picker>
          </View>}
          {isListModal && <List
    				options={options}
    				onPressItem={onPressItem}
    			/>}
        </View>
      </Modal>
		);
	}
}

const styles = StyleSheet.create({
	content: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 45,
    borderRadius: 20,
  },
  buttonsContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
  },
  title: {
		marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
	close: {
    height: 25,
    width: 25,
	},
  picker: {
  },
  pickertitle: {
    fontSize: 16,
    color: '#1D5E9E',
  },
  textinput: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#F4F4F4'
  }
});

export default CustomModal;
