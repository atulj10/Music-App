import React from "react";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";

interface HorizontalScrollSectionProps {
  title: string;
  data: DataProps[];
  borderRadius?: number;
}

export interface DataProps {
  id: number;
  name: string;
  image: any;
}

const HorizontalScrollSection = ({
  title,
  data,
  borderRadius = 20,
}: HorizontalScrollSectionProps) => {
  const renderItem = ({ item }: { item: DataProps }) => (
    <View style={styles.item}>
      <Image
        source={item.image}
        style={[
          styles.image,
          {
            borderRadius,
          },
        ]}
        resizeMode="cover"
      />
      <Text style={styles.name}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.more}>See All</Text>
      </View>

      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HorizontalScrollSection;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    marginVertical: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
  },

  more: {
    fontWeight: "800",
    color: "orange",
  },

  list: {
    paddingHorizontal: 4,
  },

  item: {
    alignItems: "center",
    marginRight: 14,
    width:100
  },

  image: {
    width: 100,
    height: 100,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
