import React from "react";
import { SvgUri } from "react-native-svg";
import { homeIcon, homeSelectedIcon } from "../../utils/icons";

const Home = ({ selected }) => {
  const uri = selected ? homeSelectedIcon : homeIcon;

  return (
    <SvgUri style={{ zIndex: 10 }} uri={uri} />
  );
};

export default Home;
