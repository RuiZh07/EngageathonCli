import React from "react";
import { SvgUri } from "react-native-svg";
import { profileIcon, profileIconSelected } from "../../utils/icons";

const Profile = ({ selected }) => {
    const uri = selected ? profileIconSelected : profileIcon;
    
    return <SvgUri uri={uri} />;
};

export default Profile;
