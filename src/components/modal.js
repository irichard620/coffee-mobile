
import React from 'react';
import Modal from 'react-native-modal';
import * as constants from '../constants';

export default function CustomModal(props) {
  const {
    visibleModal, onCloseClick, type, children
  } = props;

  // Swipe and style
  let swipeDirections = [];
  let modalStyle = {};
  if (type === constants.MODAL_TYPE_BOTTOM) {
    swipeDirections = ['down'];
    modalStyle = {
      justifyContent: 'flex-end',
      margin: 0,
    };
  } else {
    modalStyle = {
      justifyContent: 'center',
      alignSelf: 'center',
      margin: 0,
    };
  }

  return (
    <Modal
      isVisible={visibleModal}
      onSwipeComplete={onCloseClick}
      swipeDirection={swipeDirections}
      propagateSwipe
      style={modalStyle}
      onBackdropPress={onCloseClick}
    >
      {children}
    </Modal>
  );
}
