import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { formatDate } from "@/utils";
import { IBlurb } from "@/types/blurbs.types";
import { Colors } from "@/constants/Colors";

interface BlurbProps {
  item: IBlurb;
}

export default function Blurb({ item }: BlurbProps) {
  const colorScheme = useColorScheme();

  const formatMetric = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatarContainer}>
          <Image source={{ uri: item.authorImageUrl }} style={styles.avatar} />
        </ThemedView>

        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.nameContainer}>
            <ThemedText style={styles.authorName} className="font-bold">
              {item.authorName}
            </ThemedText>
            {item.verifiedBadge && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={item.verifiedBadge === "blue" ? "#1DA1F2" : "#6e767d"}
                style={styles.verifiedIcon}
              />
            )}
            {item.isOrganization && (
              <Ionicons
                name="briefcase-outline"
                size={14}
                color="#6e767d"
                style={styles.orgIcon}
              />
            )}
          </ThemedView>

          <ThemedView style={styles.handleTimeContainer}>
            <ThemedText type="defaultSemiBold">{item.authorHandle}</ThemedText>
            <ThemedText style={styles.dot}>·</ThemedText>
            <ThemedText type="defaultSemiBold">
              {formatDate(item.postedTime)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TouchableOpacity style={styles.moreButton}>
          <Feather
            name="more-horizontal"
            size={16}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <ThemedText type="defaultSemiBold">{item.message}</ThemedText>

        {item.mediaUrl && (
          <ThemedView style={styles.mediaContainer}>
            <Image
              source={{ uri: item.mediaUrl }}
              style={styles.media}
              resizeMode="cover"
            />
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.actionsContainer}>
        <TouchableOpacity style={styles.action}>
          <Feather
            name="message-circle"
            size={18}
            color={Colors[colorScheme ?? "light"].text}
          />
          <ThemedText style={styles.actionText} className="text-gray-500">
            {formatMetric(item.viewCount)}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather
            name="repeat"
            size={18}
            color={Colors[colorScheme ?? "light"].text}
          />
          <ThemedText style={styles.actionText} className="text-gray-500">
            {formatMetric(item.reBlurbCount)}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather
            name="heart"
            size={18}
            color={Colors[colorScheme ?? "light"].text}
          />
          <ThemedText style={styles.actionText} className="text-gray-500">
            {formatMetric(item.likeCount)}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather
            name="share"
            size={18}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 90,
    backgroundColor: "#ddd",
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  orgIcon: {
    marginLeft: 4,
  },
  handleTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorHandle: {
    fontSize: 13,
  },
  dot: {
    marginHorizontal: 4,
    color: "#657786",
  },
  postedTime: {
    fontSize: 13,
  },
  moreButton: {
    padding: 4,
  },
  contentContainer: {
    marginTop: 8,
    marginLeft: 50,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  mediaContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: 200,
    backgroundColor: "#e1e8ed",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginLeft: 50,
    paddingRight: 20,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 13,
    marginLeft: 4,
  },
});
