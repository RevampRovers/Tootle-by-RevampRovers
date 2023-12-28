import { useEffect, useRef, useState } from "react";
import {
  Image,
  ActivityIndicator as NativeActivityIndicator,
  RefreshControl,
  TouchableHighlight,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { ListItemSeparator } from "../components/lists";
import Screen from "../components/Screen";
import { AppNavigatorParamList } from "../navigation/AppNavigator";
import routes from "../navigation/routes";
import { Promo, offers, sosOptions } from "../utils/constants";
import colors from "../config/colors";
import { useBearStore } from "../store";

export default function SosScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<AppNavigatorParamList, routes.OFFERS>;
}) {
  const setActivePromo = useBearStore((state) => state.setActivePromo);

  return (
    <>
      <Screen
        className="p-5"
        noSafeArea
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      >
        <View>
          <View className="rounded-xl bg-white">
            {sosOptions.map(({ title, icon, subtitle }, index) => (
              <TouchableHighlight
                accessibilityRole="button"
                onPress={() => {}}
                key={title}
                underlayColor={colors.highlight}
              >
                <View>
                  {index === 0 ? null : (
                    <View className="pl-5">
                      <ListItemSeparator />
                    </View>
                  )}
                  <View className="flex-row items-center px-5 py-3">
                    <View className="h-12 w-12 rounded-full justify-center items-center">
                      <MaterialCommunityIcons
                        color={colors.primary}
                        name={icon as any}
                        size={36}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <AppText className="text-lg">{title}</AppText>
                      <View className="flex-row justify-between">
                        <AppText className="text-mediumGray text-base">
                          {subtitle}
                        </AppText>
                        {/* <AppText className="text-mediumGray text-base">
                            {toTitleCase(type)}
                          </AppText> */}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      </Screen>
    </>
  );
}
