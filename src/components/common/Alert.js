import React from "react";
import { Button, Snackbar } from 'react-native-paper';


const Alert = ({ message, onClose }) => {
  return (
    <Snackbar
        visible={true}
        onDismiss={onClose}
        style={{zIndex: 1000}}
        action={{
          label: 'Clear',
          onPress: () => onClose,
        }}>
        {message}
      </Snackbar>
  );
};
export default Alert;