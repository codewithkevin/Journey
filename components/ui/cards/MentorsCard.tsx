import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { IMentor } from "@/types/mentor.types";
import { StyledExpoImage } from "@/components/Image";
import { AntDesign } from "@expo/vector-icons";
import { blueColors, Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function MentorCard({ item }: { item: IMentor }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.mentorCard,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          shadowColor: Colors[colorScheme ?? "light"].text,
          shadowOpacity: colorScheme === "dark" ? 0.5 : 0.2,
        },
      ]}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.mentorHeader}>
        <StyledExpoImage
          source={{ uri: item.profileImage }}
          className="h-16 w-16 rounded-full"
        />
        <ThemedView style={styles.mentorInfo}>
          <ThemedText style={styles.mentorName}>{item.name}</ThemedText>
          <ThemedText style={styles.mentorTitle}>{item.title}</ThemedText>
          <View style={styles.ratingRow}>
            <AntDesign name="star" size={16} color="#FFD700" />
            <ThemedText style={styles.ratingText}>
              {item.rating.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.sessionCount}>
              ({item.sessionsCompleted} sessions)
            </ThemedText>
          </View>
        </ThemedView>
        <View
          style={[
            styles.availabilityBadge,
            { backgroundColor: item.available ? "#e8f5e9" : "#ffebee" },
          ]}
        >
          <ThemedText
            style={{
              color: item.available ? "#388e3c" : "#d32f2f",
              fontWeight: "500",
            }}
          >
            {item.available ? "Available" : "Busy"}
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedText style={styles.mentorBio} numberOfLines={2}>
        {item.bio}
      </ThemedText>

      <View style={styles.expertiseContainer}>
        {item.expertise.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <ThemedText style={styles.skillText}>{skill}</ThemedText>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mentorCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 5,
  },
  mentorHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  mentorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  mentorTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  sessionCount: {
    marginLeft: 4,
    fontSize: 14,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  mentorBio: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  expertiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: "#606E79",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#606E79",
    textAlign: "center",
  },
});
