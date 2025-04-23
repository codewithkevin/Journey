import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React from "react";
import { ICourse } from "@/types/courses.types";
import { blueColors, Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function CourseCard({ item }: { item: ICourse }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          shadowColor: Colors[colorScheme ?? "light"].text,
          shadowOpacity: colorScheme === "dark" ? 0.5 : 0.2,
        },
      ]}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <ThemedView style={[styles.badge, { backgroundColor: "#e8f5e9" }]}>
          <ThemedText style={{ color: "#388e3c" }}>{item.level}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.description} numberOfLines={3}>
        {item.description}
      </ThemedText>

      <ThemedView style={styles.cardFooter}>
        <ThemedText style={styles.price}>${item.price}</ThemedText>
        <ThemedView style={styles.courseDetailsRow}>
          <ThemedText style={styles.duration}>{item.duration}</ThemedText>
          <ThemedText style={styles.tutor}>by {item.tutor}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1DA1F2",
  },
  courseDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    marginRight: 8,
  },
  tutor: {
    fontSize: 14,
  },
});
