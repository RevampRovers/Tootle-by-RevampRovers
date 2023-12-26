import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";
// import * as Haptics from "expo-haptics";

import { navigationRef } from "./app/navigation/routeNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import AppProgress from "./app/components/AppProgress";
import AppNavigator from "./app/navigation/AppNavigator";
import OffersBottomSheet from "./app/components/OffersBottomSheet";

LogBox.ignoreLogs(["Could not find image"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

// const prefix = Linking.createURL("/3d/models");

export default function App() {
  const [user, setUser] = useState();
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <AppProgress
        visible={loadingVisible}
        onDone={() => {
          setLoadingVisible(false);
        }}
        progress={1}
      />
      <NavigationContainer theme={navigationTheme} ref={navigationRef}>
        <GestureHandlerRootView className="flex-1 bg-white">
          <AppNavigator />
          <OffersBottomSheet />
        </GestureHandlerRootView>
      </NavigationContainer>
    </>
  );
}
