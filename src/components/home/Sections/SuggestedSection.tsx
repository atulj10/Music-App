import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import HorizontalScrollSection from "../../HorizontalScrollSection";
import { useSuggestedMusic } from "../../../hooks/useSuggestedMusic";

const SuggestedSection = () => {
  const { sections, loading } = useSuggestedMusic();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {sections.map((section, index) => (
        <HorizontalScrollSection
          key={index}
          title={section.title}
          data={section.data}
          borderRadius={section.borderRadius}
        />
      ))}
    </ScrollView>
  );
};

export default SuggestedSection;

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 80,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});