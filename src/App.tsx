import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { store } from "./store";
import Home from "./tabs/Home";
import Favourites from "./tabs/Favourites";
import Settings from "./tabs/Settings";
import Playlists from "./tabs/Playlists";
import Downloads from "./tabs/Downloads";
import PlayerScreen from "./screens/PlayerScreen";
import SearchScreen from "./screens/SearchScreen";
import { Text, View } from "react-native";
import MiniPlayer from "./components/MiniPlayer";
import { useEffect } from "react";
import { setAudioModeAsync } from "expo-audio";
import QueueLoader from "./components/QueueLoader";
import QueuePersistence from "./components/QueuePersistence";
import { downloadService } from "./services/downloadService";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Favourites") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === "Queue") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Downloads") {
              iconName = focused ? "download" : "download-outline";
            } else {
              iconName = "ellipse";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FFA500",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: {
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Downloads" component={Downloads} />
        <Tab.Screen name="Favourites" component={Favourites} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Queue" component={Playlists} />
      </Tab.Navigator>

      <MiniPlayer />
    </View>
  );
}

export default function App() {

  useEffect(() => {
    const setupAudio = async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "duckOthers",
      });
      await downloadService.initialize();
    };

    setupAudio();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* Load saved queue on startup */}
        <QueueLoader />

        {/* Save queue automatically */}
        <QueuePersistence />
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlayerScreen"
            component={PlayerScreen}
            options={{ title: "Now Playing" }}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{ title: "Search" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
