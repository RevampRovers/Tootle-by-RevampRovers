import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Alert, View } from "react-native";
import { useRef, useState } from "react";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import SquareItem from "../components/SquareItem";

export default function HomeScreen() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  return (
    <Screen noSafeArea scrollRef={scrollRef} className="px-5">
      <AppText bigText className="my-5 font-bold">
        Book Ride
      </AppText>
      <View className="flex-row flex-wrap justify-between">
        {[
          {
            name: "Button",
            onPress: () => {
              Alert.alert("Button pressed");
            },
            iconName: "car",
          },
        ].map(({ name, onPress, iconName }) => (
          <SquareItem
            key={name}
            name={name}
            onPress={onPress}
            iconName={iconName}
          />
        ))}
      </View>
    </Screen>
  );
}
