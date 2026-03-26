import { Text, View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchIcon from "../../assets/icons/SearchIcon";

const CustomHeader = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>🎵 MUME</Text>
      <Pressable onPress={() => navigation.navigate("SearchScreen")}>
        <SearchIcon />
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
  logo: {
    fontSize: 20,
    fontWeight: "600",
  },
});
