import { useState } from "react";
import { RefreshControl, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ActivityIndicator from "../components/ActivityIndicator";
import AppImage from "../components/AppImage";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import AppListItems from "../components/AppListItems";
import { HomeTabNavigatorParamList } from "../navigation/HomeTabNavigator";
import AppButton from "../components/AppButton";
import AppSwitch from "../components/AppSwitch";

export default function AccountScreen({
  route,
  navigation,
}: {
  route: RouteProp<HomeTabNavigatorParamList, routes.ACCOUNT>;
  navigation: NativeStackNavigationProp<
    HomeTabNavigatorParamList,
    routes.ACCOUNT
  >;
}) {
  const [artificialLoading, setArtificialLoading] = useState(false);
  const [riderMode, setRiderMode] = useState(false);
  return (
    <>
      <ActivityIndicator
        className="bg-iosBackground"
        visible={artificialLoading}
      />
      <Screen
        className="p-5 pb-10"
        noSafeArea
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      >
        <View className="flex-1">
          <View className="mt-3 items-center">
            <AppImage
              noCache
              source={{
                uri: `https://picsum.photos/200/`,
              }}
              alt={`Avatar`}
              className="mb-4 h-24 w-24 rounded-full"
            />
            <AppText className="text-3xl font-bold">Ram Bahadur</AppText>
          </View>
          <AppListItems
            items={[
              {
                name: "Your Account",
                options: [
                  {
                    dropdown: true,
                    title: "Rider Mode",
                    subTitle: (
                      <AppSwitch
                        label="Rider Mode"
                        value={riderMode === true}
                        onValueChange={(newValue) => {
                          setRiderMode(newValue);
                        }}
                      />
                    ),
                  },
                  {
                    title: "Personal Information",
                    onPress: () => {},
                  },
                  {
                    title: "Business Account",
                    onPress: () => {},
                  },
                  {
                    title: "Emergency Contact",
                    onPress: () => {},
                  },
                  {
                    title: "Preferred Gender",
                    onPress: () => {},
                  },
                  {
                    title: "Save Locations",
                    onPress: () => {},
                  },
                ],
              },
              {
                name: "Settings",
                options: [
                  {
                    title: "Notification",
                    onPress: () => {},
                  },
                  {
                    title: "Help Center",
                    onPress: () => {},
                  },
                  {
                    title: "Terms and Conditions",
                    onPress: () => {},
                  },
                  {
                    title: "Privacy Policy",
                    onPress: () => {},
                  },
                ],
              },
            ]}
          />
        </View>
      </Screen>
    </>
  );
}
