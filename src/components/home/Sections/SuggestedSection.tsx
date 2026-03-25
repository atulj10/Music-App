import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import HorizontalScrollSection from "../../HorizontalScrollSection";

interface SuggestedSectionProps {}

const SuggestedSection = (props: SuggestedSectionProps) => {
  const data = [
    {
      title: "Recently Played",
      data: [
        {
          id: 1,
          name: "Shape of You",
          image: {
            uri: "https://picsum.photos/200?random=1",
          },
        },
        {
          id: 2,
          name: "Blinding Lights",
          image: {
            uri: "https://picsum.photos/200?random=2",
          },
        },
        {
          id: 3,
          name: "Perfect",
          image: {
            uri: "https://picsum.photos/200?random=3",
          },
        },
        {
          id: 4,
          name: "Believer",
          image: {
            uri: "https://picsum.photos/200?random=4",
          },
        },
      ],
    },

    {
      title: "Artists",
      borderRadius: 50,
      data: [
        {
          id: 1,
          name: "Arijit",
          image: {
            uri: "https://i.pravatar.cc/150?img=1",
          },
        },
        {
          id: 2,
          name: "Shreya",
          image: {
            uri: "https://i.pravatar.cc/150?img=2",
          },
        },
        {
          id: 3,
          name: "Atif",
          image: {
            uri: "https://i.pravatar.cc/150?img=3",
          },
        },
        {
          id: 4,
          name: "Neha",
          image: {
            uri: "https://i.pravatar.cc/150?img=4",
          },
        },
        {
          id: 5,
          name: "Sonu",
          image: {
            uri: "https://i.pravatar.cc/150?img=5",
          },
        },
      ],
    },

    {
      title: "Most Played",
      data: [
        {
          id: 1,
          name: "Calm Down",
          image: {
            uri: "https://picsum.photos/200?random=11",
          },
        },
        {
          id: 2,
          name: "Kesariya",
          image: {
            uri: "https://picsum.photos/200?random=12",
          },
        },
        {
          id: 3,
          name: "Levitating",
          image: {
            uri: "https://picsum.photos/200?random=13",
          },
        },
        {
          id: 4,
          name: "Starboy",
          image: {
            uri: "https://picsum.photos/200?random=14",
          },
        },
      ],
    },
  ];

  return (
    <View>
      <ScrollView style={styles.scrollContainer}>
        {data.map((section, index) => (
          <HorizontalScrollSection
            key={index}
            title={section.title}
            data={section.data}
            borderRadius={section.borderRadius}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedSection;

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 80,
  },
});
