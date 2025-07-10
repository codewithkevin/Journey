import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/useReponsiveness";

// Local images - replace these paths with your actual local images
const IMAGES = {
  image1: require("@/assets/images/tutor1.png"),
  image2: require("@/assets/images/tutor1.png"),
  image3: require("@/assets/images/tutor1.png"),
  image4: require("@/assets/images/tutor1.png"),
};

export default function MainScreen() {
  const { top } = useSafeAreaInsets();
  const { wp, hp, scale } = useResponsive();

  const renderImageRow = (count: number, startIndex: number = 0) => {
    const images = Object.values(IMAGES);
    return (
      <View style={[styles.imageRow]}>
        {Array.from({ length: count }, (_, index) => {
          const imageIndex = (startIndex + index) % images.length;
          return (
            <Image
              key={`image-${startIndex}-${index}`}
              source={images[imageIndex]}
              style={[
                styles.image,
                {
                  width: wp(15),
                  height: wp(15),
                  marginRight: wp(4),
                },
              ]}
              resizeMode="contain"
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top, padding: wp(5) }]}>
      {/* Main Image Grid Container */}
      <View
        style={[
          styles.gridContainer,
          {
            height: hp(40),
            borderRadius: wp(5),
            padding: wp(5),
          },
        ]}
      >
        {/* Row 1: 4 images */}
        {renderImageRow(4, 0)}

        {/* Row 2: 4 images */}
        {renderImageRow(4, 0)}

        {/* Row 3: 3 images */}
        {renderImageRow(3, 1)}

        {/* Row 4: 2 images */}
        {renderImageRow(2, 2)}
      </View>

      {/* Bottom Section - You can add content here */}
      <View style={styles.bottomSection}>
        <Text style={[styles.subtitle, { fontSize: scale(14) }]}>
          Responsive Image Grid - {Object.keys(IMAGES).length} unique images
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gridContainer: {
    backgroundColor: "#e6e6ea",
    justifyContent: "space-evenly",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
  },
});
