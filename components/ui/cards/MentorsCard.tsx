import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ImageBackground,
} from "react-native";
import React from "react";
import { IMentor } from "@/types/mentor.types";
import { LinearGradient } from "expo-linear-gradient"; // ← import this!
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

export default function MentorCard({ item }: { item: IMentor }) {
  const goToPost = () => {
    const postId = item.id;
    if (postId) {
      router.push(`/(index)/content/mentor-details/${postId}`);
    } else {
      console.warn("Post ID is missing, cannot navigate");
    }
  };

  return (
    <TouchableOpacity onPress={goToPost}>
      <ImageBackground
        source={{ uri: item.profileImage }}
        style={styles.imageBackground}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <ThemedText
            type="heading"
            style={{
              textAlign: "center",
            }}
          >
            {item.name}
          </ThemedText>

          <ThemedText type="defaultSemiBold">{item.location}</ThemedText>

          <ThemedText
            style={{
              textAlign: "center",
            }}
            type="defaultSemiBold"
          >
            {item.title}
          </ThemedText>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: 200,
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    borderRadius: 12,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
