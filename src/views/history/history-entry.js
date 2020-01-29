
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions,
  Image, TouchableOpacity
} from 'react-native';
import HistoryStars from './history-stars';
import ButtonLarge from '../../components/button-large';

export default function HistoryEntry(props) {
  const {
    history, index, hasRecipe, selected, onEntryClick, onDeleteClick,
    onEditClick
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  // Get date string
  const localDate = new Date(history.timestamp);
  const todayDate = new Date();
  let dateString = '';
  if (todayDate.getFullYear() === localDate.getFullYear()) {
    // Display with time
    const options = {
      weekday: 'long', month: 'short', day: 'numeric'
    };
    dateString = localDate.toLocaleDateString('en-US', options);
    // Want time like 11:30 am
    const timeOptions = {
      hour: 'numeric', minute: '2-digit'
    };
    dateString = `${dateString} \u2022 ${localDate.toLocaleTimeString('en-US', timeOptions)}`;
  } else {
    // Display with no time but with year
    const options = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    dateString = localDate.toLocaleDateString('en-US', options);
  }

  // Get title
  const title = hasRecipe ? dateString : history.recipeName;

  // Button styles
  const { width } = Dimensions.get('window');
  const mainButtonWidth = width - 32 - 56 - 8;

  return (
    <TouchableWithoutFeedback onPress={() => onEntryClick(index)}>
      <View>
        <View style={styles.outline}>
          <Text style={styles.title}>{title}</Text>
          {!hasRecipe && <Text style={styles.subtitle}>{dateString}</Text>}
          {history.stars > 0 && (
            <HistoryStars numStars={history.stars} historyId={history.historyId} />
          )}
          {selected && (
            <View>
              {history.beans !== '' && <Text style={styles.header}>COFFEE BEANS</Text>}
              {history.beans !== '' && <Text style={styles.sectionText}>{history.beans}</Text>}
              {history.notes !== '' && <Text style={styles.header}>NOTE</Text>}
              {history.notes !== '' && <Text style={styles.sectionText}>{history.notes}</Text>}
              <View style={styles.buttonView}>
                <ButtonLarge
                  title="Edit Entry"
                  margin={[0, 8, 0, 0]}
                  buttonWidth={mainButtonWidth}
                  buttonHeight={40}
                  textColor="#2D8CD3"
                  backgroundColor="#2D8CD321"
                  onButtonClick={() => onEditClick(index)}
                />
                <TouchableOpacity onPress={() => onDeleteClick(history.historyId)}>
                  <View style={styles.deleteOutline}>
                    <Image style={styles.deleteIcon} source={require(`${baseButtonPath}Journal_DeleteButton.png`)} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={styles.separator} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    fontWeight: '600',
    textAlign: 'left',
    color: '#000000',
    fontSize: 18,
    lineHeight: 23,
  },
  subtitle: {
    textAlign: 'left',
    color: '#898989',
    fontSize: 17,
    marginTop: 5
  },
  header: {
    textAlign: 'left',
    color: '#B1B1B1',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 2,
  },
  sectionText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'left',
  },
  buttonView: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  deleteOutline: {
    width: 56,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8533E21',
    borderRadius: 10
  },
  deleteIcon: {
    height: 10.25,
    resizeMode: 'contain',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    marginLeft: 16
  }
});
