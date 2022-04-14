import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

import ReloadIcon from "./components/ReloadIcon";
import WeatherInfo from "./components/WeatherInfo";
import WeatherDetails from "./components/WeatherDetails";
import UnitsPicker from "./components/UnitsPicker";

import { colors } from "./utils";

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

// const WEATHER_API_KEY = "bc8e0b40b06cc16cb2789d03d458750c";
const WEATHER_API_KEY = "4991daf33e84a95c2a155406681ccfcc";

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState("metric");

  useEffect(() => {
    load();
  }, [unitsSystem]);

  async function load() {
    setCurrentWeather(null);
    setErrorMessage(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Access to location is needed to run the app");
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(weatherUrl);

      const result = await response.json();

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker
            unitsSystem={unitsSystem}
            setUnitsSystem={setUnitsSystem}
          />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails
          currentWeather={currentWeather}
          unitsSystem={unitsSystem}
        />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <ReloadIcon load={load} />
        <Text style={{ textAlign: "center", color: "white" }}>
          {errorMessage}
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#222",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
});
