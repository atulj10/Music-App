import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./tabs/Home";
import Favourites from "./tabs/Favourites";
import Settings from "./tabs/Settings";
import Playlists from "./tabs/Playlists";
import PlayerScreen from "./screens/PlayerScreen";
import SearchScreen from "./screens/SearchScreen";
import { Text, View } from "react-native";
import MiniPlayer from "./components/MiniPlayer";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Favourites" component={Favourites} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Queue" component={Playlists} />
      </Tab.Navigator>

      <MiniPlayer />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
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
