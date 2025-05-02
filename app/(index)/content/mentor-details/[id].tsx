import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useMemo, useState, useRef } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BodyScrollView } from "@/components/BodyScrollView";
import sampleFeedItems from "@/dummy/posts.json";
import { IJob } from "@/types/job.types";
import { IMentor } from "@/types/mentor.types";
import { IBlurb } from "@/types/blurbs.types";
import { ICourse } from "@/types/courses.types";
import { ThemedText } from "@/components/ThemedText";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

type ContentItem = IMentor;

export default function MentorDetails() {
  const params = useLocalSearchParams();
  const postId = params.id as string;

  const findPost = useMemo(() => {
    const post = sampleFeedItems.find((item) => item.id === postId);

    if (post) {
      return post as ContentItem;
    }

    if (postId.startsWith("post-")) {
      const parts = postId.split("-");
      if (parts.length >= 2) {
        const potentialPosterId = parts[1];

        const posterPost = sampleFeedItems.find(
          (item) => "poster_id" in item && item.poster_id === potentialPosterId
        );

        if (posterPost) {
          return posterPost as ContentItem;
        }
      }
    }

    return undefined;
  }, [postId]);

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
            <View className="flex-row items-center justify-between">
              <TouchableOpacity></TouchableOpacity>
              <ThemedText type="subtitle">Mentor Details</ThemedText>
              <TouchableOpacity></TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView></ScrollView>
    </>
  );
}
