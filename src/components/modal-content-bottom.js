
import React from 'react';
import {
  View, Text, StyleSheet, TextInput, Picker, KeyboardAvoidingView,
  Dimensions, ScrollView
} from 'react-native';
import List from './list';
import PullDown from './pulldown';
import ButtonLarge from './button-large';

export default function ModalContentBottom(props) {
  const {
    modalText, textPlaceholder, modalSelect,
    onPressItem, onChangeText, onModalSave, onChangePicker, isListModal,
    isSelectInput, options, title, charLimit, pickerValues, hasSave,
  } = props;

  // Elems with atleast one text
  const isTextInput = !isListModal;

  // Max height for modal
  const { height, width } = Dimensions.get('window');
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
        <Text style={styles.title}>{title}</Text>
        <View style={styles.titleSeparator} />
        {!(isListModal && !hasSave) && <View style={styles.topListSeparator} />}
        {isTextInput && (
        <TextInput
          onChangeText={text => onChangeText(text)}
          value={modalText}
          placeholder={textPlaceholder}
          placeholderTextColor="#898989"
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
        {isListModal && (
          <ScrollView>
            <List
              options={options}
              onPressItem={onPressItem}
            />
          </ScrollView>
        )}
        {hasSave && (
          <View style={styles.saveContainer}>
            <ButtonLarge
              onButtonClick={onModalSave}
              title="Save"
              margin={[0, 16, 0, 16]}
              buttonWidth={width - 32}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  saveContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8
  },
  title: {
    marginTop: 36,
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    alignSelf: 'flex-start',
  },
  titleSeparator: {
    height: 1,
    backgroundColor: '#F1F3F6',
  },
  topListSeparator: {
    height: 16,
  },
  pickertitle: {
    fontSize: 16,
    color: '#1D5E9E',
  },
  textinput: {
    marginLeft: 16,
    marginRight: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F2F3F6'
  }
});
