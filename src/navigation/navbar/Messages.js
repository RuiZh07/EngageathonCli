import React from "react";
import { SvgUri } from "react-native-svg";
import { messagesIcon, messagesSelectedIcon } from "../../utils/icons";

const Messages = ({ selected }) => {
  const uri = selected ? messagesSelectedIcon : messagesIcon;

  return <SvgUri uri={uri} />;
};

export default Messages;
