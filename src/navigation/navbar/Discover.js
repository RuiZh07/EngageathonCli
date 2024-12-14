import React from "react";
import { SvgUri } from "react-native-svg";
import { discoverIcon, discoverSelectedIcon } from "../../utils/icons";

const Discover = ({ selected }) => {
  const uri = selected ? discoverSelectedIcon : discoverIcon;
  
  return <SvgUri uri={uri} />;
};

export default Discover;
