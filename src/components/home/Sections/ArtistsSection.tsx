import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface ArtistsSectionProps {}

const ArtistsSection = (props: ArtistsSectionProps) => {
  return (
    <View style={styles.container}>
      <Text>ArtistsSection</Text>
    </View>
  );
};

export default ArtistsSection;

const styles = StyleSheet.create({
  container: {},
});
