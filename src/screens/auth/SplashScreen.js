import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';

function SplashScreen() {

  const gradientColors = ['#FF8D00', '#FFDE1A'];
  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate("Login");
  }

  function handleSignUp() {
    navigation.navigate("Signup");
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/backgroundImage.png")}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <View style={styles.engageathonLogoContainer}>
        <Image source={require("../../assets/eaLogo.png")} style={{ width: 35, height: 32, marginRight: 5 }} />
        <Image source={require("../../assets/EngageATHON.png")} />
      </View>


      <View style={styles.welcomeText}>
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "Poppins-Bold",
            fontSize: 32,
            lineHeight: 34.09,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Welcome to{"\n"}ENGAGEATHON
        </Text>

        <Text
          style={{
            width: 244,
            height: 51,
            color: "#DBDBDB",
            fontFamily: "Inter-Medium",
            fontSize: 14,
            lineHeight: 16.94,
            
          }}
        >
          "Redefine ENGAGEMENT {"\n"} Amplify ESG"
        </Text>
      </View>

      <View style={styles.navigationButtonContainer}>
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
  
          <LinearGradient
            colors={["#FF8D00", "#FFBA00", "#FFE600"]}
            locations={[0.72, 0.86, 1]}  
            start={{ x: 0, y: 0 }}      
            end={{ x: 1, y: 0 }}
            style={styles.buttonContainer}
          >
            <Text style={styles.loginText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8}>
          <View style={styles.signUpButtonContainer}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"flex-end",
    backgroundColor: "#fff",
  },
  engageathonLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
    marginTop: 100,
  },
  welcomeText: {
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 100,
  },
  navigationButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 311,
    height: 56,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  signUpButtonContainer: {
    width: 311,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#C9C9C9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FFFFFF',
  },
});

export default SplashScreen;
