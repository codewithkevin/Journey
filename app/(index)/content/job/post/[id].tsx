import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import React, { useMemo } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import sampleFeedItems from "@/dummy/posts.json";
import { IJob } from "@/types/job.types";
import { BodyScrollView } from "@/components/BodyScrollView";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Button from "@/components/ui/Button";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import SwipeToApplyButton from "@/components/ui/SwipeToApplyButton";

export default function JobDetails() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const postId = params.id as string;

  const findPost = useMemo(() => {
    const post = sampleFeedItems.find((item) => item.id === postId);

    if (post) {
      return post as IJob;
    }

    if (postId.startsWith("post-")) {
      const parts = postId.split("-");
      if (parts.length >= 2) {
        const potentialPosterId = parts[1];

        const posterPost = sampleFeedItems.find(
          (item) => "poster_id" in item && item.poster_id === potentialPosterId
        );

        if (posterPost) {
          return posterPost as IJob;
        }
      }
    }

    return undefined;
  }, [postId]);

  const handleApply = () => {
    // Here you can handle the application logic
    console.log("Application submitted for:", findPost?.jobTitle);

    // You could navigate to another screen, show a confirmation modal, etc.
    // For now, let's just log it (the feedback is shown in the button animation)
  };

  if (!findPost) {
    return (
      <>
        <Stack.Screen
          options={{
            headerLargeTitle: false,
            headerShown: false,
          }}
        />
        <BodyScrollView className="flex-1">
          <Text className="text-center p-4">Mentor not found</Text>
        </BodyScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          headerShown: true,
          headerTitle: () => (
            <View className="flex-row items-center justify-between w-full">
              <Button onPress={() => router.back()} variant="outline">
                <Ionicons name="chevron-back" size={20} color="white" />
              </Button>

              <ThemedText type="subtitle">Job Details</ThemedText>
              <Button variant="outline" style={{ borderRadius: 20 }}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </Button>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <LinearGradient
            colors={
              colorScheme === "dark"
                ? ["#000000", "#171717"]
                : ["#FFFFFF", "#FFFFFF"]
            }
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#171719",
              gap: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                height: 250,
                borderWidth: 1,
                borderColor: "#171719",
                borderRadius: 40,
              }}
            />
          </LinearGradient>
        </View>

        <View className="flex items-center justify-center bottom-16 gap-10">
          <Image
            source={{ uri: findPost.profileImage }}
            style={{
              width: "23%",
              height: 95,
              borderWidth: 1,
              borderColor: "#171719",
              borderRadius: 10,
            }}
          />

          <View className="gap-2">
            <ThemedText type="title">{findPost.jobTitle}</ThemedText>
            <ThemedText
              style={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {findPost.company}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-center justify-between mx-16">
          <View className="items-center gap-2">
            <Button
              style={{
                backgroundColor: "#171717",
                padding: 10,
                borderRadius: 100,
                height: 60,
                width: 60,
              }}
            >
              <FontAwesome6 name="money-check-dollar" size={24} color="white" />
            </Button>
            <View className="items-center">
              <ThemedText>Salary</ThemedText>
              <ThemedText type="smallBold">{findPost.salary}</ThemedText>
            </View>
          </View>

          <View className="items-center gap-2">
            <Button
              style={{
                backgroundColor: "#171717",
                padding: 10,
                borderRadius: 100,
                height: 60,
                width: 60,
              }}
            >
              <FontAwesome6 name="money-check-dollar" size={24} color="white" />
            </Button>
            <View className="items-center">
              <ThemedText>Job Time</ThemedText>
              <ThemedText type="smallBold">
                {findPost.isFullTime ? "Full Time" : "Part Time"}
              </ThemedText>
            </View>
          </View>

          <View className="items-center gap-2">
            <Button
              style={{
                backgroundColor: "#171717",
                padding: 10,
                borderRadius: 100,
                height: 60,
                width: 60,
              }}
            >
              <Ionicons name="location-outline" size={24} color="white" />
            </Button>
            <View className="items-center">
              <ThemedText>Location</ThemedText>
              <ThemedText type="smallBold">{findPost.location}</ThemedText>
            </View>
          </View>
        </View>

        <View className="mt-16 mx-5 gap-2">
          <ThemedText type="subtitle">Job Description</ThemedText>
          <ThemedText
            style={{
              textAlign: "justify",
              lineHeight: 24,
            }}
            type="smallBold"
          >
            {findPost.description}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Replace the original Button with our new SwipeToApplyButton */}
      <SwipeToApplyButton
        onApply={handleApply}
        text="Swipe to Apply"
        trackColor="#f5f5f5"
        thumbColor="black"
        textColor="black"
      />
    </>
  );
}
