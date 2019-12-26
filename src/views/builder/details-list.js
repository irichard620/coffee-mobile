
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Detail from './detail';
import BuilderListHeader from './builder-list-header';

class DetailsList extends Component {
  renderItem = (detail, idx) => {
    const {
      onDetailClick, details
    } = this.props;

    const showSeparator = (idx < details.length - 1);

    return (
      <React.Fragment>
        <Detail
          key={idx}
          value={detail.value}
          title={detail.title}
          modalId={detail.modalId}
          disabled={detail.disabled}
          onDetailClick={onDetailClick}
        />
        {showSeparator && <View style={styles.separator} />}
      </React.Fragment>
    );
  };

  render() {
    const { details } = this.props;

    return (
      <View style={styles.outline}>
        <BuilderListHeader title="Details" textColor="#FFAB0D" />
        <View style={styles.separator} />
        {details.map((detail, idx) => (
          this.renderItem(detail, idx)
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    width: '100%'
  }
});

export default DetailsList;
