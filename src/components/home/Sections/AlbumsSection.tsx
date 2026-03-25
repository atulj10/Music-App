import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface AlbumSectionProps {}

const AlbumSection = (props: AlbumSectionProps) => {
  return (
    <View style={styles.container}>
      <Text>AlbumSection</Text>
    </View>
  );
};

export default AlbumSection;

const styles = StyleSheet.create({
  container: {}
});
