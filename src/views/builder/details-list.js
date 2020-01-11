
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
      <Detail
        key={idx}
        value={detail.value}
        title={detail.title}
        modalId={detail.modalId}
        disabled={detail.disabled}
        onDetailClick={onDetailClick}
        showArrow={detail.showArrow}
        showSeparator={showSeparator}
        descriptionColor={detail.descriptionColor}
      />
    );
  };

  render() {
    const { details } = this.props;

    return (
      <View>
        <BuilderListHeader title="Details" textColor="#FFAB0D" />
        <View style={[styles.separator]} />
        {details.map((detail, idx) => (
          this.renderItem(detail, idx)
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
  }
});

export default DetailsList;
