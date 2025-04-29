import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { StoryCircle } from "@/components/ui/stories/StoryCircle";
import { StoryViewer } from "@/components/ui/stories/StoryViewer";

// Define the Story interface
interface Story {
  id: string;
  username: string;
  userAvatar: string;
  content: string;
  viewed: boolean;
  timestamp: string;
}

// Define the props interface for StoriesComponent
interface StoriesComponentProps {
  stories: Story; // Change to Story[] if it should receive an array
}

export default function StoriesComponent({ stories }: StoriesComponentProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);

  // This is needed for tracking viewed status if we're receiving a single story prop
  const [viewedStatus, setViewedStatus] = useState(stories.viewed);

  const handleStoryPress = (story: Story) => {
    setSelectedStory(story);
    setStoryViewerVisible(true);
  };

  const handleCloseStory = () => {
    setStoryViewerVisible(false);

    if (selectedStory) {
      // Update the viewed status for the story
      setViewedStatus(true);
      // Note: Since we're not managing an array of stories in this component anymore,
      // we don't need the setStories function from before
    }
  };

  const handleStoryComplete = () => {
    handleCloseStory();
    // Could implement logic to show the next story here
  };

  return (
    <ThemedView style={{ paddingHorizontal: 10 }}>
      <View style={styles.storiesContainer}>
        <StoryCircle
          key={stories.id}
          story={{ ...stories, viewed: viewedStatus }} // Use the local viewed state
          onPress={() => handleStoryPress(stories)}
        />
      </View>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          isVisible={storyViewerVisible}
          onClose={handleCloseStory}
          onStoryComplete={handleStoryComplete}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  storiesContainer: {
    flexDirection: "row",
  },
  storyCircleContainer: {
    alignItems: "center",
    marginRight: 15,
    width: 70,
  },
});
