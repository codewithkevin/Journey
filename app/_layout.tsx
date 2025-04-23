import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AnimatedSplash from "react-native-animated-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <AnimatedSplash
      translucent
      isLoaded={loaded}
      logoImage={{
        uri: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
      }}
      backgroundColor="#000000"
      logoHeight={150}
      logoWidth={150}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Slot />
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AnimatedSplash>
  );
}
