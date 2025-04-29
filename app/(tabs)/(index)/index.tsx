import { AntDesign } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  ScrollView,
  FlatList,
} from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { categoryTabs } from "@/dummy/categoryTabs.dummy";
import { useMemo } from "react";
import contentData from "../../../dummy/posts.json";
import storyData from "../../../dummy/stories.json";
import { IJob } from "@/types/job.types";
import { ICourse } from "@/types/courses.types";
import { IMentor } from "@/types/mentor.types";
import CourseCard from "@/components/ui/cards/CourseCard";
import MentorCard from "@/components/ui/cards/MentorsCard";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { useContentData } from "@/hooks/useContentData";
import { ThemedText } from "@/components/ThemedText";
import StoriesComponent from "@/components/ui/stories/Story";
import { IBlurb } from "@/types/blurbs.types";
import Blurb from "@/components/ui/Blurbs";

type ContentItem = IJob | ICourse | IMentor | IBlurb;

const TabContent = ({ tabName }: { tabName: string }) => {
  const { data, loading } = useContentData(tabName);

  const renderItem = ({ item }: { item: ContentItem }) => {
    switch (item.category) {
      case "course":
        return <CourseCard item={item} />;
      case "mentorship":
        return <MentorCard item={item} />;
      case "blurbs":
        return <Blurb item={item} />;
      default:
        return null;
    }
  };

  if (loading) return null;

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AntDesign name="inbox" size={64} color="#d0d0d0" />
        <Text style={styles.emptyText}>No content available</Text>
      </View>
    );
  }

  if (tabName === "Find Mentors") {
    const mentors = data.filter((item) => item.category === "mentorship");

    return (
      <Tabs.ScrollView
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: 100, marginTop: 10, gap: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderStories()}
        {mentors.length > 0 && (
          <View style={styles.sectionContainer}>
            <ThemedText
              style={{
                marginLeft: 10,
              }}
              type="heading"
            >
              Top Mentors
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {mentors.map((item) => (
                <View key={item.id} style={styles.cardContainer}>
                  <MentorCard item={item} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {mentors.length > 0 && (
          <View style={styles.sectionContainer}>
            <ThemedText
              style={{
                marginLeft: 10,
              }}
              type="heading"
            >
              Suggested Mentors
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {mentors.map((item) => (
                <View key={item.id} style={styles.cardContainer}>
                  <MentorCard item={item} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {mentors.length > 0 && (
          <View style={styles.sectionContainer}>
            <ThemedText
              style={{
                marginLeft: 10,
              }}
              type="heading"
            >
              New Mentors
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginHorizontal: 6,
              }}
            >
              {mentors.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: "50%",
                    paddingHorizontal: 6,
                    marginBottom: 12,
                  }}
                >
                  <MentorCard item={item} />
                </View>
              ))}
            </View>
          </View>
        )}
      </Tabs.ScrollView>
    );
  }

  return (
    <Tabs.FlatList
      data={data}
      ListHeaderComponent={renderStories()}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: 100, gap: 20 },
      ]}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const activeColor =
    colorScheme === "dark" ? "#FFFFFF" : Colors[colorScheme ?? "light"].text;
  const inactiveColor =
    colorScheme === "dark" ? "#777777" : Colors[colorScheme ?? "light"].icon;
  const indicatorColor =
    colorScheme === "dark" ? "#FFFFFF" : Colors[colorScheme ?? "light"].text;
  const backgroundColor = Colors[colorScheme ?? "light"].primary;

  const renderTabBar = (props: any) => (
    <MaterialTabBar
      {...props}
      indicatorStyle={{
        backgroundColor: indicatorColor,
        height: 3,
        borderRadius: 50,
      }}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      scrollEnabled
      style={{
        paddingHorizontal: 20,
        textAlign: "center",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: backgroundColor,
        paddingTop: 70,
      }}
      labelStyle={{
        marginHorizontal: 10,
        opacity: 1,
        fontWeight: "bold",
        textTransform: "capitalize",
        textAlign: "center",
        height: 24,
        fontSize: 15,
      }}
    />
  );

  return (
    <ThemedView className="flex-1">
      <Tabs.Container
        renderTabBar={renderTabBar}
        pagerProps={{ scrollEnabled: true }}
        initialTabName="Blurbs"
        minHeaderHeight={-190}
        revealHeaderOnScroll
        headerContainerStyle={{
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        }}
        headerHeight={insets.top + 60}
      >
        {categoryTabs.map((tab) => (
          <Tabs.Tab name={tab} key={tab}>
            <TabContent tabName={tab} />
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </ThemedView>
  );
}

const renderStories = () => {
  return (
    <FlatList
      data={storyData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <StoriesComponent stories={item} />}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 32,
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
  sectionContainer: {
    marginBottom: 24,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  horizontalList: {
    paddingBottom: 8,
  },
  cardContainer: {
    marginHorizontal: 6,
  },
});
