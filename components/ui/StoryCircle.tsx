import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface Story {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  viewed: boolean;
  timestamp: string;
}

interface StoryCircleProps {
  story: Story;
  onPress: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({ story, onPress }) => {
  return (
    <TouchableOpacity style={styles.storyCircleContainer} onPress={onPress}>
      <ThemedView
        style={[
          styles.storyCircleBorder,
          story.viewed ? styles.viewedStory : styles.unwatchedStory,
        ]}
      >
        <Image source={{ uri: story.userAvatar }} style={styles.avatarImage} />
      </ThemedView>
      <ThemedText type="defaultSemiBold" numberOfLines={1}>
        {story.username}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyCircleContainer: {
    alignItems: "center",
    marginRight: 1,
    width: 70,
    gap: 3,
  },
  storyCircleBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  unwatchedStory: {
    borderWidth: 2,
    borderColor: "#FF4400",
  },
  viewedStory: {
    borderWidth: 2,
    borderColor: "#A9A9A9",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  username: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    width: 64,
  },
  storyViewerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
});
