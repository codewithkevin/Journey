import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Story {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  viewed: boolean;
  timestamp: string;
}

interface StoryViewerProps {
  story: Story;
  isVisible: boolean;
  onClose: () => void;
  onStoryComplete: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  isVisible,
  onClose,
  onStoryComplete,
}) => {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      progress.setValue(0);

      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          onStoryComplete();
        }
      });
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.storyViewerContainer}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        {/* User info */}
        <View style={styles.storyHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: story.userAvatar }}
              style={styles.storyAvatarImage}
            />
            <Text style={styles.storyUsername}>{story.username}</Text>
            <Text style={styles.timestamp}>{story.timestamp}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Story content */}
        <Image
          source={{ uri: story.content }}
          style={styles.storyContent}
          resizeMode="cover"
        />

        {/* Touch areas to navigate */}
        <View style={styles.touchAreas}>
          <TouchableOpacity style={styles.prevTouch} onPress={onClose}>
            <View />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextTouch} onPress={onStoryComplete}>
            <View />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  storiesContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  storyCircleContainer: {
    alignItems: "center",
    marginRight: 15,
    width: 70,
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
    borderColor: "#FF4400", // Instagram's story gradient typically includes this color
  },
  viewedStory: {
    borderWidth: 2,
    borderColor: "#A9A9A9", // Gray border for viewed stories
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
  progressContainer: {
    flexDirection: "row",
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: "white",
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  storyAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  storyUsername: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    color: "white",
    fontSize: 12,
    marginLeft: 10,
    opacity: 0.7,
  },
  closeButton: {
    color: "white",
    fontSize: 24,
  },
  storyContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  touchAreas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  prevTouch: {
    width: "30%",
    height: "100%",
  },
  nextTouch: {
    width: "70%",
    height: "100%",
  },
});
