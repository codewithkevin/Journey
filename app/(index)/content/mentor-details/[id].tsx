import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
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

type ContentItem = IMentor;

const TabButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full ${
      isActive ? "bg-gray-600" : "bg-transparent"
    }`}
  >
    <ThemedText
      type="defaultSemiBold"
      className={`${isActive ? "text-white" : "text-gray-400"} `}
    >
      {label}
    </ThemedText>
  </TouchableOpacity>
);

export default function MentorDetails() {
  const params = useLocalSearchParams();
  const postId = params.id as string;
  const [activeTab, setActiveTab] = useState("Overview");
  const [showMore, setShowMore] = useState(false);

  // Animation value for the scrolling effect
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 500; // Default height
  const maxHeaderHeight = 600; // Maximum height when pulled down

  // Calculate the dynamic height based on scroll position
  const headerHeightAnim = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [maxHeaderHeight, headerHeight],
    extrapolate: "clamp",
  });

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
          headerShown: false,
        }}
      />
      <Animated.ScrollView
        className="flex-1"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={{ height: headerHeightAnim }}>
          <ImageBackground
            source={{ uri: findPost.profileImage }}
            style={{
              width: "100%",
              height: "100%",
            }}
            responsivePolicy="static"
            contentFit="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 100,
                justifyContent: "flex-end",
                paddingBottom: 16,
                paddingHorizontal: 16,
              }}
            >
              <ThemedText type="title" className="text-white text-2xl">
                {findPost.name}
              </ThemedText>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* Rest of your content goes here */}
        <View className="p-4">
          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-4"
          >
            {["Overview", "Experience", "Education", "Skills"].map((tab) => (
              <TabButton
                key={tab}
                label={tab}
                isActive={activeTab === tab}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </ScrollView>

          {/* Content area */}
          <View className="min-h-screen">
            <ThemedText type="default" className="text-base mb-4">
              {findPost.description || "No description available."}
            </ThemedText>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}
