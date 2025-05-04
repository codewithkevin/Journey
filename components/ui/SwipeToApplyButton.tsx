import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface SwipeToApplyProps {
  onApply: () => void;
  text?: string;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
}

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 30;
const THUMB_SIZE = 60;
const TRACK_HEIGHT = 75;

const SwipeToApplyButton: React.FC<SwipeToApplyProps> = ({
  onApply,
  text = "Swipe to Apply",
  trackColor = "#f5f5f5",
  thumbColor = "black",
  textColor = "black",
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const maxSlideDistance = BUTTON_WIDTH - THUMB_SIZE - 10;

  useEffect(() => {
    if (!isCompleted) {
      translateX.setValue(0);
      fadeAnim.setValue(1);
      successOpacity.setValue(0);
    }
  }, [isCompleted, translateX, fadeAnim, successOpacity]);

  // Add haptic feedback when switching states
  useEffect(() => {
    // This is a placeholder - to add actual haptic feedback, you would need to:
    // 1. Install react-native-haptic-feedback
    // 2. Import and use it like: ReactNativeHapticFeedback.trigger('impactMedium')
    const listener = translateX.addListener(({ value }) => {
      if (value > maxSlideDistance * 0.75 && value < maxSlideDistance * 0.78) {
        // This is where you would trigger haptic feedback when threshold is crossed
        console.log("Haptic feedback would trigger here");
      }
    });

    return () => {
      translateX.removeListener(listener);
    };
  }, [maxSlideDistance, translateX]);

  const animateSuccess = () => {
    // Trigger success animation with pulse effect
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Add a pulse animation to the success message
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: maxSlideDistance - 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: maxSlideDistance,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Call onApply callback
      onApply();

      // Reset after 1.5 seconds
      setTimeout(() => {
        setIsCompleted(false);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1500);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isCompleted,
      onMoveShouldSetPanResponder: () => !isCompleted,
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx;
        // Constrain movement between 0 and maxSlideDistance
        if (newX >= 0 && newX <= maxSlideDistance) {
          translateX.setValue(newX);
        } else if (newX > maxSlideDistance) {
          // Allow a bit of resistance when dragging beyond limit
          translateX.setValue(
            maxSlideDistance + (newX - maxSlideDistance) * 0.2
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        // Check if user has dragged far enough to trigger action
        if (gestureState.dx > maxSlideDistance * 0.8) {
          setIsCompleted(true);
          Animated.spring(translateX, {
            toValue: maxSlideDistance,
            useNativeDriver: true,
            friction: 6,
            tension: 40,
          }).start(animateSuccess);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  const progressScale = translateX.interpolate({
    inputRange: [0, maxSlideDistance],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const progressBackgroundColor = translateX.interpolate({
    inputRange: [
      0,
      maxSlideDistance * 0.4,
      maxSlideDistance * 0.8,
      maxSlideDistance,
    ],
    outputRange: ["#8BC753", "#8BC753", "#8BC753", "#8BC753"],
    extrapolate: "clamp",
  });

  // Determine if we're near completion threshold to change text
  const isNearCompletion = translateX.interpolate({
    inputRange: [0, maxSlideDistance * 0.75, maxSlideDistance * 0.76],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Track (background) */}
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
          },
        ]}
      >
        {/* Progress Indicator (filling behind thumb) */}
        <Animated.View
          style={[
            styles.progressTrack,
            {
              backgroundColor: progressBackgroundColor,
              transform: [{ scaleX: progressScale }],
            },
          ]}
        />

        {/* Instruction Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Initial swipe text */}
          <Animated.View
            style={{
              opacity: translateX.interpolate({
                inputRange: [0, maxSlideDistance * 0.7, maxSlideDistance * 0.8],
                outputRange: [1, 1, 0],
                extrapolate: "clamp",
              }),
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.swipeText, { color: textColor }]}
            >
              {text}
            </ThemedText>
          </Animated.View>

          {/* "Confirm submission" text when near completion */}
          <Animated.View
            style={{
              opacity: translateX.interpolate({
                inputRange: [maxSlideDistance * 0.7, maxSlideDistance * 0.8],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              position: "absolute",
              width: "100%",
              alignItems: "center",
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.swipeText,
                { color: textColor, fontWeight: "bold" },
              ]}
            >
              Confirm Submission
            </ThemedText>
          </Animated.View>
        </Animated.View>

        {/* Success Message (appears after completion) */}
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: successOpacity,
            },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.successText, { color: textColor }]}
          >
            Application Submitted!
          </ThemedText>
        </Animated.View>
      </Animated.View>

      {/* Draggable Thumb */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.thumb,
          {
            backgroundColor: translateX.interpolate({
              inputRange: [0, maxSlideDistance * 0.8, maxSlideDistance],
              outputRange: [thumbColor, thumbColor, "#1eb478"], // Change to green near completion
              extrapolate: "clamp",
            }),
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Arrow Right Icon (default) */}
        <Animated.View
          style={{
            opacity: translateX.interpolate({
              inputRange: [0, maxSlideDistance * 0.7, maxSlideDistance * 0.8],
              outputRange: [1, 1, 0],
              extrapolate: "clamp",
            }),
          }}
        >
          <Feather name="arrow-right" size={16} color="#fff" />
        </Animated.View>

        <Animated.View
          style={{
            opacity: translateX.interpolate({
              inputRange: [maxSlideDistance * 0.7, maxSlideDistance * 0.8],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            position: "absolute",
          }}
        >
          <Feather name="check" size={16} color="#fff" />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
    height: TRACK_HEIGHT,
    position: "relative",
  },
  track: {
    width: BUTTON_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 99,
    paddingHorizontal: 20,
    position: "absolute",
    overflow: "hidden",
  },
  progressTrack: {
    height: TRACK_HEIGHT,
    width: BUTTON_WIDTH, // Fixed width instead of animated width
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    transformOrigin: "left", // Scale from left side
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
  },
  swipeText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  successContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 5,
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default SwipeToApplyButton;
