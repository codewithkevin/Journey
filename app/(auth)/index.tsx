import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/useReponsiveness";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { zincColors } from "@/constants/Colors";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const IMAGE_SETS = {
  journey: {
    image1: require("@/assets/images/mock/tutor4.png"),
    image2: require("@/assets/images/mock/tutor2.png"),
    image3: require("@/assets/images/mock/tutor3.png"),
    image4: require("@/assets/images/mock/tutor5.png"),
  },
  tutors: {
    image1: require("@/assets/images/mock/student1.png"),
    image2: require("@/assets/images/mock/student2.png"),
    image3: require("@/assets/images/mock/student3.png"),
    image4: require("@/assets/images/mock/course5.png"),
  },
  students: {
    image1: require("@/assets/images/mock/group1.png"),
    image2: require("@/assets/images/mock/group2.png"),
    image3: require("@/assets/images/mock/tutor1.png"),
    image4: require("@/assets/images/mock/tutor5.png"),
  },
  courses: {
    image1: require("@/assets/images/mock/tutor8.png"),
    image2: require("@/assets/images/mock/tutor9.png"),
    image3: require("@/assets/images/mock/tutor3.png"),
    image4: require("@/assets/images/mock/student1.png"),
  },
};

const ROW_CONFIG = [
  { count: 4, imageSet: "journey", label: "Journey" },
  { count: 4, imageSet: "tutors", label: "Tutors" },
  { count: 3, imageSet: "students", label: "Students" },
  { count: 2, imageSet: "courses", label: "Courses" },
] as const;

type ImageSetKey = keyof typeof IMAGE_SETS;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const BUTTON_SIZE = 60;
const BUTTON_MARGIN = 30;
const EXPANDED_WIDTH = screenWidth / 1.12;
const EXPANDED_HEIGHT = screenHeight / 3;

export default function MainScreen() {
  const { top } = useSafeAreaInsets();
  const { wp, hp, scale } = useResponsive();
  const [showLabels, setShowLabels] = useState(false);
  const { signIn: googleSignIn, isSigninInProgress } = useGoogleAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProgress = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const iconOpacity = useSharedValue(1);

  const renderImageRow = (
    count: number,
    imageSet: ImageSetKey,
    startIndex: number = 0,
    label?: string
  ) => {
    const images = Object.values(IMAGE_SETS[imageSet]);
    return (
      <View style={styles.rowContainer}>
        {/* Optional row label */}
        {showLabels && label && (
          <Text
            style={[
              styles.rowLabel,
              { fontSize: scale(10), marginBottom: wp(2) },
            ]}
          >
            {label}
          </Text>
        )}

        <View style={styles.imageRow}>
          {Array.from({ length: count }, (_, index) => {
            const imageIndex = (startIndex + index) % images.length;
            return (
              <Image
                key={`${imageSet}-${startIndex}-${index}`}
                source={images[imageIndex]}
                style={[
                  styles.image,
                  {
                    width: wp(15),
                    height: wp(15),
                    marginRight: index < count - 1 ? wp(4) : 0,
                  },
                ]}
                resizeMode="contain"
              />
            );
          })}
        </View>
      </View>
    );
  };

  const handlePress = () => {
    if (isExpanded) {
      // Collapse animation
      animationProgress.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
      iconRotation.value = withTiming(0, { duration: 300 });
      iconOpacity.value = withTiming(1, { duration: 200 });

      setTimeout(() => {
        runOnJS(setIsExpanded)(false);
      }, 100);
    } else {
      // Expand animation
      setIsExpanded(true);
      animationProgress.value = withSpring(1, {
        damping: 18,
        stiffness: 200,
      });
      iconRotation.value = withTiming(45, { duration: 300 });
      iconOpacity.value = withTiming(0, { duration: 150 });
    }
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [BUTTON_SIZE, EXPANDED_WIDTH]
    );

    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [BUTTON_SIZE, EXPANDED_HEIGHT]
    );

    const borderRadius = interpolate(
      animationProgress.value,
      [0, 1],
      [BUTTON_SIZE / 2, 24]
    );

    return {
      width,
      height,
      borderRadius,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
      opacity: iconOpacity.value,
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animationProgress.value, [0, 0.3, 1], [0, 0, 0.3]),
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          padding: wp(7),
          gap: wp(20),
        },
      ]}
    >
      <View
        style={[
          styles.gridContainer,
          {
            height: hp(40),
            borderRadius: wp(4),
            paddingVertical: wp(3),
          },
        ]}
      >
        {ROW_CONFIG.map((rowConfig) =>
          renderImageRow(
            rowConfig.count,
            rowConfig.imageSet,
            0,
            rowConfig.label
          )
        )}
      </View>

      <View
        style={[
          styles.bottomSection,
          {
            gap: wp(20),
          },
        ]}
      >
        <View
          style={{
            gap: wp(3),
          }}
        >
          <ThemedText
            type="title"
            style={{
              textAlign: "center",
              lineHeight: wp(11),
            }}
            className="leading-9"
          >
            Learn Today, Lead Tomorrow
          </ThemedText>

          <ThemedText
            style={{
              color: zincColors[500],
            }}
            className="text-center font-semibold px-10"
          >
            Discover courses and connect with industry leaders to take the next
            step in your career.
          </ThemedText>
        </View>

        <Button
          style={{
            width: wp(70),
            backgroundColor: "#181F20",
          }}
          size="lg"
        >
          Get Started
        </Button>
      </View>

      {/* Background overlay */}
      <Animated.View
        style={[styles.overlay, overlayAnimatedStyle]}
        pointerEvents={isExpanded ? "auto" : "none"}
      >
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handlePress}
        />
      </Animated.View>

      {/* Morphing button */}
      <Animated.View style={[styles.floatingButton, containerAnimatedStyle]}>
        <Pressable style={styles.buttonContent} onPress={handlePress}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <Pressable onPress={handlePress} style={styles.plusIcon}>
              <View style={styles.plusHorizontal} />
              <View style={styles.plusVertical} />
            </Pressable>
          </Animated.View>

          {/* Expanded content area */}
          {isExpanded && (
            <Pressable
              style={styles.expandedContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.contentPlaceholder} />
              <View style={styles.contentPlaceholder} />
              <View style={styles.contentPlaceholder} />
            </Pressable>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    backgroundColor: "#e6e6ea",
    justifyContent: "space-evenly",
  },
  rowContainer: {
    alignItems: "center",
  },
  rowLabel: {
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
  },
  bottomSection: {
    alignItems: "center",
  },
  // Morphing button styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: BUTTON_MARGIN,
    right: BUTTON_MARGIN,
    backgroundColor: "#000",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
  },
  buttonContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  plusHorizontal: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "white",
    borderRadius: 1,
  },
  plusVertical: {
    position: "absolute",
    width: 2,
    height: 16,
    backgroundColor: "white",
    borderRadius: 1,
  },
  expandedContent: {
    flex: 1,
    width: "100%",
    marginTop: 40,
    gap: 16,
  },
  contentPlaceholder: {
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    width: "100%",
  },
});
