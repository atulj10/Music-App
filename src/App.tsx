import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./tabs/Home";
import Favourites from "./tabs/Favourites";
import Settings from "./tabs/Settings";
import Playlists from "./tabs/Playlists";
import { NavigationContainer } from "@react-navigation/native";
import CustomHeader from "./components/home/CustomHeader";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Favourites" component={Favourites} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Playlists" component={Playlists} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
