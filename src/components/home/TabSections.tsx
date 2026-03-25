import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";

import SuggestedSection from "./Sections/SuggestedSection";
import SongsSection from "./Sections/SongsSection";
import RecentSection from "./Sections/RecentSection";
import ArtistsSection from "./Sections/ArtistsSection";
import AlbumSection from "./Sections/AlbumsSection";

interface TabSectionProps {}

const TabSection = (props: TabSectionProps) => {
  const [tab, setTab] = useState(0);

  const tabs = [
    { title: "Suggested", page: SuggestedSection },
    { title: "Songs", page: SongsSection },
    { title: "Artists", page: ArtistsSection },
    { title: "Albums", page: AlbumSection },
    { title: "Recent", page: RecentSection },
  ];

  const handleTabPress = (index: number) => {
    setTab(index);
  };

  const renderTab = ({ item, index }: any) => (
    <Pressable onPress={() => handleTabPress(index)}>
      <Text
        style={[
          styles.deafult,
          tab === index ? styles.active : styles.unActive,
        ]}
      >
        {item.title}
      </Text>
    </Pressable>
  );

  const ActiveComponent = tabs[tab].page;

  return (
    <View>
      <FlatList
        data={tabs}
        horizontal
        keyExtractor={(item) => item.title}
        renderItem={renderTab}
        showsHorizontalScrollIndicator={false}
      />
      <View style={{ marginTop: 15 }}>
        <ActiveComponent />
      </View>
    </View>
  );
};

export default TabSection;

const styles = StyleSheet.create({
  unActive: {
    color: "grey",
    padding: 10,
  },
  active: {
    color: "orange",
    padding: 10,
    fontWeight: "800",
    borderBottomWidth: 2,
    borderBottomColor: "orange",
  },
  deafult: {
    minWidth: 100,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
