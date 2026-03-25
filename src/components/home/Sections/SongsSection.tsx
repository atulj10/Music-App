import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SongsSectionProps {}

const SongsSection = (props: SongsSectionProps) => {
  return (
    <View style={styles.container}>
      <Text>SongsSection</Text>
    </View>
  );
};

export default SongsSection;

const styles = StyleSheet.create({
  container: {}
});
