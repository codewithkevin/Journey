import { Tabs } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type TabIconProps = {
  color: string;
};

type CubeTabButtonProps = {
  index: number;
  icon: (color: string) => React.ReactNode;
  label: string;
};

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const tabScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(0.8)).current,
    useRef(new Animated.Value(0.8)).current,
    useRef(new Animated.Value(0.8)).current,
  ];

  const navigateToTab = (index: number): void => {
    if (activeTab === index) return;

    tabScales.forEach((scale, i) => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: i === index ? 1.2 : 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: i === index ? 1 : 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setActiveTab(index);
    switch (index) {
      case 0:
        router.replace("/(index)/(tabs)/(index)");
        break;
      case 1:
        router.replace("/(index)/(tabs)/(search)");
        break;
      case 2:
        router.replace("/(index)/(tabs)/(notifications)");
        break;
      case 3:
        router.replace("/(index)/(tabs)/(messages)");
        break;
    }
  };

  const TabButton = ({ index, icon, label }: CubeTabButtonProps) => {
    const isActive = activeTab === index;
    const textColor = isActive
      ? Colors[colorScheme ?? "light"].tint
      : Colors[colorScheme ?? "light"].tabIconDefault;

    return (
      <Animated.View
        style={[
          styles.tabButtonContainer,
          {
            transform: [{ scale: tabScales[index] }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.tabButton]}
          onPress={() => navigateToTab(index)}
          activeOpacity={0.7}
          accessibilityLabel={label}
        >
          {icon(textColor)}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="(index)" />
        <Tabs.Screen name="(search)" />
        <Tabs.Screen name="(notifications)" />
        <Tabs.Screen name="(messages)" />
      </Tabs>

      <View style={[styles.tabBarContainer, { paddingBottom: bottomInset }]}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={90}
            tint={colorScheme === "dark" ? "dark" : "light"}
            style={styles.blurContainer}
          />
        ) : (
          <View
            style={[
              styles.blurContainer,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(30,30,30,0.9)"
                    : "rgba(255,255,255,0.9)",
              },
            ]}
          />
        )}

        <View style={styles.tabButtonsWrapper}>
          <TabButton
            index={0}
            label="Home"
            icon={(color) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            )}
          />
          <TabButton
            index={1}
            label="Search"
            icon={(color) => <Feather name="search" size={28} color={color} />}
          />
          <TabButton
            index={2}
            label="Notifications"
            icon={(color) => (
              <IconSymbol size={28} name="bell.badge" color={color} />
            )}
          />
          <TabButton
            index={3}
            label="Messages"
            icon={(color) => (
              <IconSymbol size={28} name="message.badge" color={color} />
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  tabButtonsWrapper: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  tabButtonContainer: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  tabButton: {
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
