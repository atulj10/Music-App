import React, { memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ListRenderItem,
  ImageSourcePropType,
} from "react-native";

interface HorizontalScrollSectionProps {
  title: string;
  data: DataProps[];
  borderRadius?: number;
  onItemPress?: (item: DataProps) => void;
}

export interface DataProps {
  id: number | string;
  name: string;
  image: ImageSourcePropType;
}

const ITEM_SIZE = 100;

const HorizontalScrollSection = ({
  title,
  data,
  borderRadius = 20,
  onItemPress,
}: HorizontalScrollSectionProps) => {
  const renderItem: ListRenderItem<DataProps> = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => onItemPress?.(item)}
    >
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

      <Text
        style={styles.name}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Pressable>
          <Text style={styles.more}>See All</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No data available</Text>}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE + 14,
          offset: (ITEM_SIZE + 14) * index,
          index,
        })}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
};

export default memo(HorizontalScrollSection);

const styles = StyleSheet.create({
  container: {
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
    width: ITEM_SIZE,
  },

  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
});