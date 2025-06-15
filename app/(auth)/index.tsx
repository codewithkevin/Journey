import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/useReponsiveness";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { zincColors } from "@/constants/Colors";

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

// Row configuration for easy customization
const ROW_CONFIG = [
  { count: 4, imageSet: "journey", label: "Journey" },
  { count: 4, imageSet: "tutors", label: "Tutors" },
  { count: 3, imageSet: "students", label: "Students" },
  { count: 2, imageSet: "courses", label: "Courses" },
] as const;

type ImageSetKey = keyof typeof IMAGE_SETS;

export default function MainScreen() {
  const { top } = useSafeAreaInsets();
  const { wp, hp, scale } = useResponsive();
  const [showLabels, setShowLabels] = useState(false);

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
});
