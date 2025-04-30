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
import JobCard from "@/components/ui/cards/JobCard";

type ContentItem = IJob | ICourse | IMentor | IBlurb;

const TabContent = ({ tabName }: { tabName: string }) => {
  const { data, loading } = useContentData(tabName);

  const renderItem = ({ item }: { item: ContentItem }) => {
    switch (item.category) {
      case "blurbs":
        return <Blurb item={item} />;
      case "job":
        return <JobCard item={item} />;
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

    return renderMentors({ mentors });
  }

  if (tabName === "Courses") {
    const courses: ICourse[] = data.filter(
      (item) => item.category === "course"
    );

    return renderCourses({ courses });
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
      ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
    />
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView className="flex-1">
      <Tabs.Container
        renderTabBar={renderTabBar}
        pagerProps={{ scrollEnabled: true }}
        initialTabName="Find Mentors"
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

const renderTabBar = (props: any) => {
  const colorScheme = useColorScheme();

  const activeColor =
    colorScheme === "dark" ? "#FFFFFF" : Colors[colorScheme ?? "light"].text;
  const inactiveColor =
    colorScheme === "dark" ? "#777777" : Colors[colorScheme ?? "light"].icon;
  const indicatorColor =
    colorScheme === "dark" ? "#FFFFFF" : Colors[colorScheme ?? "light"].text;
  const backgroundColor = Colors[colorScheme ?? "light"].primary;

  return (
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
};

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

const renderCourses = ({ courses }: { courses: ICourse[] }) => {
  const sections = [
    {
      title: "Stories",
      data: [null],
      renderItem: () => renderStories(),
    },
    {
      title: "Top Courses",
      data: [null],
      renderItem: () => (
        <View
          style={{
            gap: 10,
          }}
        >
          <ThemedText type="title" style={{ marginLeft: 15 }}>
            Top Courses
          </ThemedText>
          <FlatList
            data={courses}
            renderItem={({ item }) => (
              <View>
                <CourseCard item={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              marginHorizontal: 5,
            }}
          />
        </View>
      ),
    },
    {
      title: "New Courses",
      data: [null],
      renderItem: () => (
        <View style={{ gap: 10 }}>
          <ThemedText type="subtitle" style={{ marginLeft: 15 }}>
            New Courses
          </ThemedText>
          <FlatList
            data={courses}
            renderItem={({ item }) => <CourseCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              marginHorizontal: 5,
            }}
          />
        </View>
      ),
    },
  ];

  return (
    <Tabs.SectionList
      sections={sections}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 10,
        paddingTop: 10,
      }}
    />
  );
};

const renderMentors = ({ mentors }: { mentors: IMentor[] }) => {
  const sections = [
    {
      title: "Stories",
      data: [null],
      renderItem: () => renderStories(),
    },
    {
      title: "Top Mentors",
      data: [null],
      renderItem: () => (
        <View style={{ gap: 15 }}>
          <ThemedText
            style={{
              marginLeft: 10,
            }}
            type="heading"
          >
            Top Mentors
          </ThemedText>
          <FlatList
            data={mentors}
            renderItem={({ item }) => <MentorCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              marginHorizontal: 10,
              gap: 25,
            }}
          />
        </View>
      ),
    },
    {
      title: "Suggested Mentors",
      data: [null],
      renderItem: () => (
        <View style={{ gap: 15 }}>
          <ThemedText
            style={{
              marginLeft: 10,
            }}
            type="heading"
          >
            Suggested Mentors
          </ThemedText>
          <FlatList
            data={mentors}
            renderItem={({ item }) => <MentorCard item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              marginHorizontal: 10,
              gap: 25,
            }}
          />
        </View>
      ),
    },
    {
      title: "New Mentors",
      data: [null],
      renderItem: () => (
        <View style={{ gap: 15, paddingHorizontal: 15 }}>
          <ThemedText type="heading">New Mentors</ThemedText>
          <FlatList
            data={mentors}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: "48%",
                  marginRight: index % 2 === 0 ? "4%" : 0,
                  marginBottom: 15,
                }}
              >
                <MentorCard item={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
          />
        </View>
      ),
    },
  ];

  return (
    <Tabs.SectionList
      sections={sections}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 10,
        paddingTop: 10,
        paddingBottom: 100,
      }}
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
