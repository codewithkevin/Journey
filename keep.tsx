import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

// Components
const TabButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full ${
      isActive ? "bg-gray-700" : "bg-transparent"
    }`}
  >
    <Text
      className={`${isActive ? "text-white" : "text-gray-400"} font-medium`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Main component
export default function MentorProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params.id as string;
  const [activeTab, setActiveTab] = useState("Overview");
  const [showMore, setShowMore] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -50],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const profileData = {
    name: "Dina Septiani",
    country: "Indonesia",
    title: "Product Designer at Tokopedia",
    about:
      "A Product Designer who's had the fortune of being part of 3 successfully sold startups spanning a 18 year career...",
    fullAbout:
      "A Product Designer who's had the fortune of being part of 3 successfully sold startups spanning a 18 year career. Experienced in working with cross-functional teams to deliver user-centered design solutions that drive business growth and enhance user experience.",
    experience: [
      {
        role: "Product Designer",
        company: "Tokopedia",
        period: "2018 - Present",
        logo: "https://placehold.co/200x200/22c55e/FFFFFF.png?text=T",
      },
      {
        role: "UIX Design Mentor",
        company: "Skillful",
        period: "2020 - 2021",
        logo: "https://placehold.co/200x200/ef4444/FFFFFF.png?text=S",
      },
    ],
    reviews: 56,
    profileImage:
      "https://placehold.co/400x600/d4d4d8/1c1917.png?text=Profile+Image",
  };

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 w-10 h-10 bg-gray-600/70 rounded-full items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Help button */}
      <TouchableOpacity className="absolute top-12 right-16 z-10 w-10 h-10 bg-gray-600/70 rounded-full items-center justify-center">
        <Ionicons name="help" size={24} color="white" />
      </TouchableOpacity>

      {/* Share button */}
      <TouchableOpacity className="absolute top-12 right-4 z-10 w-10 h-10 bg-gray-600/70 rounded-full items-center justify-center">
        <Ionicons name="share-outline" size={24} color="white" />
      </TouchableOpacity>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="relative">
          <Animated.View style={[{ height: 450 }, headerAnimatedStyle]}>
            <Image
              source={{ uri: profileData.profileImage }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
              }}
            />
          </Animated.View>

          {/* Profile Info */}
          <View className="px-4 pt-2 pb-4">
            <View className="flex-row items-center">
              <Text className="text-white text-3xl font-semibold">
                {profileData.name}
              </Text>
              <Image
                source={{
                  uri: "https://placehold.co/30x20/ff0000/FFFFFF.png?text=ID",
                }}
                style={{ width: 24, height: 16, marginLeft: 8 }}
              />
            </View>
            <Text className="text-white text-lg mt-1">{profileData.title}</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row px-4 py-2 bg-gray-900">
          <TabButton
            label="Overview"
            isActive={activeTab === "Overview"}
            onPress={() => setActiveTab("Overview")}
          />
          <TabButton
            label="Reviews"
            isActive={activeTab === "Reviews"}
            onPress={() => setActiveTab("Reviews")}
          />
          <TabButton
            label="Time Slot"
            isActive={activeTab === "Time Slot"}
            onPress={() => setActiveTab("Time Slot")}
          />
        </View>

        {/* Content based on active tab */}
        {activeTab === "Overview" && (
          <View className="px-4 pt-4 bg-gray-900">
            {/* About Section */}
            <View className="bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-white text-xl font-semibold mb-2">
                About
              </Text>
              <Text className="text-gray-300">
                {showMore ? profileData.fullAbout : profileData.about}
                {!showMore && (
                  <TouchableOpacity onPress={() => setShowMore(true)}>
                    <Text className="text-blue-400"> Show more</Text>
                  </TouchableOpacity>
                )}
              </Text>
            </View>

            {/* Experience Section */}
            <View className="bg-gray-800 rounded-lg p-4 mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-semibold">
                  Experience
                </Text>
                <TouchableOpacity>
                  <Text className="text-blue-400">See All</Text>
                </TouchableOpacity>
              </View>

              {/* Experience Items */}
              {profileData.experience.map((exp, index) => (
                <View key={index} className="flex-row mb-4">
                  <View className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                    <Image
                      source={{ uri: exp.logo }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-medium text-lg">
                      {exp.role}
                    </Text>
                    <Text className="text-gray-400">
                      {exp.company} • {exp.period}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Reviews" && (
          <View className="p-4 bg-gray-900">
            <Text className="text-white text-lg">
              {profileData.reviews} reviews available
            </Text>
          </View>
        )}

        {activeTab === "Time Slot" && (
          <View className="p-4 bg-gray-900">
            <Text className="text-white text-lg">Available time slots</Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* Floating Contact Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity className="bg-white w-14 h-14 rounded-full items-center justify-center">
          <MaterialCommunityIcons name="message-text" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
