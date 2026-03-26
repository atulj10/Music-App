import { Text, View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Ionicons name="musical-notes" size={24} color="#FFA500" />
        <Text style={styles.logo}> MUME</Text>
      </View>
      <Pressable onPress={() => navigation.navigate("SearchScreen")}>
        <Ionicons name="search" size={24} color="#333" />
      </Pressable>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "600",
  },
});
