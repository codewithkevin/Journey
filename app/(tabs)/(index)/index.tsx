import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Text, useColorScheme } from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import users from "../../../dummy/users.json";
import { categoryTabs } from "@/dummy/categoryTabs.dummy";
import { StyledExpoImage } from "@/components/Image";
import { useMemo } from "react";

import contentData from "../../../dummy/posts.json";
import { IJob } from "@/types/job.types";
import { ICourse } from "@/types/courses.types";
import { IMentor } from "@/types/mentor.types";
import CourseCard from "@/components/ui/cards/CourseCard";
import MentorCard from "@/components/ui/cards/MentorsCard";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

type ContentItem = IJob | ICourse | IMentor;

const Header = () => {
  const currentUser = users[0];
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: Colors[colorScheme ?? "light"].primary,
      }}
      className="w-full bg-white dark:bg-black"
    >
      <View className="w-full flex-row items-center justify-between px-4 py-2">
        <View>
          <StyledExpoImage
            source={{
              uri: currentUser.profile_picture,
            }}
            className="h-10 w-10 rounded-full"
          />
        </View>

        <View>
          {/* <StyledExpoImage
            source={require("../../../assets/svg/aside/3.png")}
            className="h-12 w-12 rounded-full"
          /> */}
        </View>

        <View />
      </View>
    </View>
  );
};

const TabContent = ({ tabName }: { tabName: string }) => {
  const data = useMemo(() => {
    switch (tabName) {
      case "Find Mentors":
        return contentData.filter((item) => item.category === "mentorship");
      case "Featured Mentors":
        return contentData.filter(
          (item) => item.tags && item.tags.includes("Featured Mentors")
        );
      case "Mentors":
        return contentData.filter((item) => item.category === "mentorship");
      case "Courses":
        return contentData.filter((item) => item.category === "course");
      case "Journals":
        return contentData;
      default:
        return [];
    }
  }, [tabName]);

  const renderItem = ({ item }: { item: ContentItem }) => {
    switch (item.category) {
      case "course":
        return <CourseCard item={item} />;
      case "mentorship":
        return <MentorCard item={item} />;
      default:
        return null;
    }
  };

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AntDesign name="inbox" size={64} color="#d0d0d0" />
        <Text style={styles.emptyText}>No content available</Text>
      </View>
    );
  }

  return (
    <Tabs.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
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
        renderHeader={Header}
        renderTabBar={renderTabBar}
        pagerProps={{ scrollEnabled: true }}
        initialTabName="Find Mentors"
        minHeaderHeight={-60}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  listContainer: {
    paddingHorizontal: 16,
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
});
