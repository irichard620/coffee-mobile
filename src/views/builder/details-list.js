
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Detail from './detail';
import BuilderListHeader from './builder-list-header';

class DetailsList extends Component {
  renderItem = (detail, idx) => {
    const {
      onDetailClick
    } = this.props;

    return (
      <Detail
        key={idx}
        value={detail.value}
        title={detail.title}
        modalId={detail.modalId}
        disabled={detail.disabled}
        onDetailClick={onDetailClick}
      />
    );
  };

  render() {
    const { details } = this.props;

    return (
      <View style={styles.outline}>
        <BuilderListHeader title="Details" textColor="#FFAB0D" />
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
  }
});

export default DetailsList;
