import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { IJob } from "@/types/job.types";
import { formatDate } from "@/utils";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { blueColors, Colors } from "@/constants/Colors";

export default function JobCard({ item }: { item: IJob }) {
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
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {item.title}
        </ThemedText>
        <ThemedView style={[styles.badge, { backgroundColor: "#e1f5fe" }]}>
          <ThemedText style={{ color: "#0288d1" }}>{item.type}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.companyName}>{item.company}</ThemedText>

      <ThemedView style={styles.locationRow}>
        <AntDesign name="enviromento" size={16} color="#606E79" />
        <ThemedText style={styles.locationText}>{item.location}</ThemedText>
      </ThemedView>

      <ThemedText style={styles.description} numberOfLines={2}>
        {item.description}
      </ThemedText>

      <ThemedView style={styles.cardFooter}>
        <ThemedText type="defaultSemiBold" style={styles.salary}>
          {item.salary}
        </ThemedText>
        <ThemedText style={styles.date}>
          {formatDate(item.postedDate)}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
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
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
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
  salary: {
    fontSize: 16,
    color: "#1DA1F2",
  },
  date: {
    fontSize: 14,
  },
});
