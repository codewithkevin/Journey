import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React from "react";
import { ICourse } from "@/types/courses.types";
import { blueColors, Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Image, ImageBackground } from "expo-image";

export default function CourseCard({ item }: { item: ICourse }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity>
      <ThemedView
        style={{
          backgroundColor:
            colorScheme === "dark" ? "#171717" : Colors.light.background,
          padding: 13,
          marginHorizontal: 10,
          borderRadius: 20,
          width: 260,
          height: 290,
          gap: 5,
        }}
      >
        <Image
          source={{
            uri: item.coverImage,
          }}
          style={{
            width: "100%",
            height: "57%",
            borderRadius: 20,
            resizeMode: "cover",
          }}
        />

        <View className="gap-1">
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>

          <ThemedText type="link">{item.duration}</ThemedText>
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText type="defaultSemiBold">{item.tutor}</ThemedText>

          <ThemedText type="defaultSemiBold">$ {item.price}</ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
