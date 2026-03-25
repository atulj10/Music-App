import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/home/CustomHeader";
import TabSection from "../components/home/TabSections";

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <CustomHeader />
      <TabSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  sectionsContainer: {
    paddingBottom: 100,
  },
});
