
import React from 'react';
import {
  View, Text, StyleSheet, TextInput, Picker, KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modal';
import List from './list';
import Button from './button';
import PullDown from './pulldown';

export default function CustomModal(props) {
  const {
    visibleModal, modalId, modalText, textPlaceholder, modalSelect, onCloseClick,
    onPressItem, onChangeText, onModalSave, onChangePicker, isListModal,
    isSelectInput, options, title, pickerValues
  } = props;

  // Elems with atleast one text
  const isTextInput = !isListModal;
  let isTitle = false;
  if (title && title !== '') {
    isTitle = true;
  }

  return (
    <Modal
      isVisible={visibleModal}
      onSwipeComplete={onCloseClick}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <KeyboardAvoidingView
        behavior="position"
        enabled
      >
        <View style={styles.content}>
          <PullDown />
          {isTitle && <Text style={styles.title}>{title}</Text>}
          {isTextInput && (
          <TextInput
            onChangeText={text => onChangeText(text)}
            value={modalText}
            placeholder={textPlaceholder}
            placeholderTextColor="#b7b3b3"
            style={styles.textinput}
          />
          )}
          {isSelectInput && (
          <View style={styles.picker}>
            <Picker
              selectedValue={modalSelect}
              onValueChange={onChangePicker}
              itemStyle={styles.pickertitle}
            >
              {pickerValues.map(pickerVal => (
                <Picker.Item label={pickerVal} value={pickerVal} />
              ))}
            </Picker>
          </View>
          )}
          {!isListModal && (
            <View style={styles.saveContainer}>
              <Button
                onButtonClick={() => onModalSave(modalId)}
                type={0}
                title="Save"
                width={110}
                margin={[0, 0, 0, 0]}
              />
            </View>
          )}
          {isListModal && (
            <View style={styles.listContainer}>
              <List
                options={options}
                onPressItem={onPressItem}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 45,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  saveContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    marginTop: 35,
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
  pickertitle: {
    fontSize: 16,
    color: '#1D5E9E',
  },
  textinput: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#F4F4F4'
  },
  listContainer: {
    marginTop: 35
  }
});
