
import React from 'react';
import {
  View, Text, StyleSheet, TextInput, Picker, KeyboardAvoidingView,
  Dimensions, ScrollView
} from 'react-native';
import List from './list';
import Button from './button';
import PullDown from './pulldown';

export default function ModalContentBottom(props) {
  const {
    modalText, textPlaceholder, modalSelect,
    onPressItem, onChangeText, onModalSave, onChangePicker, isListModal,
    isSelectInput, options, title, charLimit, pickerValues
  } = props;

  // Elems with atleast one text
  const isTextInput = !isListModal;
  let isTitle = false;
  if (title && title !== '') {
    isTitle = true;
  }

  // Max height for modal
  const { height } = Dimensions.get('window');
  const maxHeightModal = {
    maxHeight: height * 0.75
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      enabled
    >
      <View style={[styles.content, maxHeightModal]}>
        <PullDown />
        {isTitle && <Text style={styles.title}>{title}</Text>}
        {isTextInput && (
        <TextInput
          onChangeText={text => onChangeText(text)}
          value={modalText}
          placeholder={textPlaceholder}
          placeholderTextColor="#b7b3b3"
          style={styles.textinput}
          maxLength={charLimit}
          multiline={false}
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
              onButtonClick={onModalSave}
              type={0}
              title="Save"
              margin={[0, 0, 0, 0]}
            />
          </View>
        )}
        {isListModal && (
          <ScrollView>
            <List
              options={options}
              onPressItem={onPressItem}
            />
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#1D5E9E',
    alignSelf: 'flex-start',
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
