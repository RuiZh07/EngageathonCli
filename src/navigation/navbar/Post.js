{/*import React from "react";
import { SvgUri } from "react-native-svg";
import { postIcon } from "../../utils/icons";

const Post = () => {
  return <SvgUri uri={postIcon} />;
};

export default Post;

*/}

import React from "react";
import { Image } from "react-native";
import postIcon from "../../assets/icons/plus.png";
const Post = () => {
  return <Image source={postIcon} />;
};


export default Post;
