import { Text, View, StyleSheet, Dimensions } from "react-native";
import SearchIcon from "../../assets/icons/SearchIcon";

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>🎵 MUME</Text>
      <SearchIcon />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 15,
  },
  logo: {
    fontSize: 20,
    fontWeight: "600",
  },
});
