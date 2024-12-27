/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/auth/Login";
import Signup1 from "./src/screens/auth/Signup";
import Signup from "./src/screens/auth/Signup";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ForgotPassword from "./src/screens/auth/ForgotPassword";
import OnboardTutorial from "./src/screens/auth/OnboardTutorial";
import SplashScreen from "./src/screens/auth/SplashScreen";
import AccountTypeSignup from "./src/screens/auth/AccountTypeSignup";
import CodeVerificationScreen from "./src/screens/auth/CodeVerificationScreen";
import ResetPasswordScreen from "./src/screens/auth/ResetPasswordScreen";
import TagCause from "./src/screens/auth/TagCauseScreen";
import InvitationScreen from "./src/screens/auth/InvitationScreen";
import HomeScreen from "./src/screens/home/HomeScreen";
import Tabs from "./src/navigation/TabNavigator";
import FollowersFollowingScreen from "./src/screens/profile/FollowersFollowingScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import UpcomingEventScreen from "./src/screens/profile/UpcomingEventScreen";
import CalendarScreen from "./src/screens/calendar/CalendarScreen";
import SettingScreen from "./src/screens/setting/SettingScreen";
import DeleteAccountScreen from "./src/screens/setting/DeleteAccountScreen";
import DiscoverScreen from "./src/screens/discover/DiscoverScreen";
import PrivacyPolicyScreen from "./src/screens/setting/PrivacyPolicyScreen";
import ChangePasswordScreen from "./src/screens/setting/ChangePasswordScreen";
import BecomeMemberScreen from "./src/screens/setting/BecomeMemberScreen";
import CreateActivityScreen from "./src/screens/contentCreation/CreateActivityScreen";
import CreateEventScreen from "./src/screens/contentCreation/CreateEventScreen";
import CreatePostScreen from "./src/screens/contentCreation/CreatePostScreen";
import ImageSelectionScreen from "./src/screens/contentCreation/ImageSelectionScreen";
import TagCauseEvent from "./src/screens/contentCreation/TagCauseEvent";
import TagCausePost from "./src/screens/contentCreation/TagCausePost";
import { CategoryProvider } from "./src/components/contentCreation/CategoryContext";
import QRCodeScreen from "./src/screens/calendar/QRCodeScreen";
import EventHubScreen from "./src/screens/calendar/EventHubScreen";
import LeaderboardScreen from "./src/screens/calendar/LeaderboardScreen";
import UserProfileScreen from "./src/screens/discover/UserProfileScreen";
import PostDetailScreen from "./src/screens/profile/PostDetailScreen";
import ShareModal from "./src/components/modals/ShareModal";
import DiscoverPostDetailScreen from "./src/screens/discover/DiscoverPostDetailScreen";
import InviteContactScreen from "./src/screens/setting/InviteContactScreen";
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Simulate some loading time for the splash screen
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, []);

  return (
    <CategoryProvider>
    <NavigationContainer>
{/*
      <Stack.Navigator initialRouteName="InviteContactScreen">
       
      */}
       <Stack.Navigator initialRouteName={isLoggedIn ? "Tabs" : "OnboardTutorial"}>
        <Stack.Screen name="OnboardTutorial" component={OnboardTutorial} options={{ headerShown: false }} />

        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
     
        <Stack.Screen name="Signup" component={Signup} options={{ title: "Sign-Up", headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="AccountTypeSignup" component={AccountTypeSignup} options={{ headerShown: false }} />
        <Stack.Screen name="CodeVerificationScreen" component={CodeVerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TagCause" component={TagCause} options={{ headerShown: false }} />
        <Stack.Screen name="InvitationScreen" component={InvitationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateActivityScreen" component={CreateActivityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TagCauseEvent" component={TagCauseEvent} options={{ headerShown: false }} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="UpcomingEventScreen" component={UpcomingEventScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventHubScreen" component={EventHubScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TagCausePost" component={TagCausePost} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FollowersFollowingScreen" component={FollowersFollowingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ShareModal" component={ShareModal} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiscoverPostDetailScreen" component={DiscoverPostDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ImageSelectionScreen" component={ImageSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InviteContactScreen" component={InviteContactScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BecomeMemberScreen" component={BecomeMemberScreen} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </CategoryProvider>
  )
}
export default App;
