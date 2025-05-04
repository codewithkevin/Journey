import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { IJob } from "@/types/job.types";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { router } from "expo-router";
import { truncatedString } from "@/utils";

export default function JobCard({ item }: { item: IJob }) {
  const colorScheme = useColorScheme();

  const goToPost = () => {
    const postId = item.id;
    if (postId) {
      router.push(`/(index)/content/job/post/${postId}`);
    } else {
      console.warn("Post ID is missing, cannot navigate");
    }
  };

  return (
    <TouchableOpacity onPress={goToPost}>
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#000000", "#171717"]
            : ["#FFFFFF", "#FFFFFF"]
        }
        style={{
          padding: 20,
          marginHorizontal: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#171719",
          gap: 20,
        }}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center gap-7">
            <Image
              source={{ uri: item.profileImage }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 80,
                resizeMode: "cover",
              }}
            />
            <ThemedView>
              <ThemedText type="subtitle">{item.jobTitle}</ThemedText>
              <ThemedText type="smallBold">{item.company}</ThemedText>
            </ThemedView>
          </View>

          {/* <TouchableOpacity style={styles.bookmarkButton}>
          <Feather name={"bookmark"} size={24} color={"#666666"} />
        </TouchableOpacity> */}
        </View>

        <View className="flex-row items-center gap-4">
          <ThemedView
            style={{
              backgroundColor: "#232323",
            }}
            className="items-center justify-center p-2 rounded-3xl"
          >
            <ThemedText type="smallBold">
              {item.isFullTime ? "Full time" : "Part time"}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              backgroundColor: "#232323",
            }}
            className="items-center justify-center p-2 rounded-3xl"
          >
            <ThemedText type="smallBold">{item.location}</ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              backgroundColor: "#232323",
            }}
            className="items-center justify-center p-2 rounded-3xl"
          >
            <ThemedText type="smallBold">{item.experience}</ThemedText>
          </ThemedView>
        </View>

        <ThemedText>{truncatedString(item.description, 150)}</ThemedText>

        <View className="flex-row justify-between items-center">
          <ThemedText type="subtitle">{item.salary}</ThemedText>

          <TouchableOpacity className="flex-row items-center bg-white p-[0.5rem] gap-2 rounded-3xl">
            <ThemedText
              type="smallBold"
              style={{
                color: "#000000",
              }}
            >
              {item.postedTime}
            </ThemedText>

            <ThemedView
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="arrow-right" size={16} color="#fff" />
            </ThemedView>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
