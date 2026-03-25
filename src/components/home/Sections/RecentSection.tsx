import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface RecentSectionProps {}

const RecentSection = (props: RecentSectionProps) => {
  return (
    <View style={styles.container}>
      <Text>RecentSection</Text>
    </View>
  );
};

export default RecentSection;

const styles = StyleSheet.create({
  container: {}
});
