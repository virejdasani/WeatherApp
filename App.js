import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";

// const WEATHER_API_KEY = "bc8e0b40b06cc16cb2789d03d458750c";
const WEATHER_API_KEY = "4991daf33e84a95c2a155406681ccfcc";

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      // request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

      const response = await fetch(weatherUrl).then((response) =>
        response.json()
      );

      if (response.cod !== 200) {
        setCurrentWeather(response);
      } else {
        setErrorMessage(response.message);
      }

      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  if (currentWeather) {
    const temp = currentWeather.main.temp;
    console.log(temp);
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>{temp}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>loading</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
});
