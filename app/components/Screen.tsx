import { ReactElement, ReactNode, RefObject, useRef } from "react";
import {
  RefreshControlProps,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";
import { useScrollToTop } from "@react-navigation/native";
import colors from "../config/colors";

export default function Screen({
  children,
  style,
  noKeyboardAwareScroll,
  noSafeArea,
  className,
  scrollRef,
  refreshControl,
  backgroundColor = colors.iosBackground,
}: {
  children: ReactNode;
  style?: Object;
  noKeyboardAwareScroll?: boolean;
  noSafeArea?: boolean;
  className?: string;
  scrollRef?: RefObject<ScrollView>;
  refreshControl?: ReactElement<RefreshControlProps>;
  backgroundColor?: string;
}) {
  const netInfo = useNetInfo();

  const internet =
    netInfo.type !== "unknown" && netInfo.isInternetReachable === false;
  const morePaddingTop = internet && !internet;
  return (
    <SafeAreaOnCondition
      condition={!noSafeArea}
      backgroundColor={backgroundColor}
    >
      <KeyboardAwareScrollOnCondition
        condition={!noKeyboardAwareScroll}
        style={style}
        className={className}
        morePaddingTop={morePaddingTop}
        scrollRef={scrollRef}
        refreshControl={refreshControl}
      >
        {children}
      </KeyboardAwareScrollOnCondition>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
    </SafeAreaOnCondition>
  );
}

function SafeAreaOnCondition({
  condition,
  backgroundColor,
  children,
}: {
  condition: boolean;
  backgroundColor: string;
  children: ReactNode;
}) {
  if (condition) {
    return (
      <SafeAreaView
        style={[
          {
            paddingTop: Constants.statusBarHeight,
            paddingBottom: 0,
            backgroundColor,
          },
        ]}
        className="flex-1"
      >
        {children}
      </SafeAreaView>
    );
  }
  return (
    <View
      style={{
        backgroundColor,
      }}
      className="flex-1"
    >
      {children}
    </View>
  );
}

function KeyboardAwareScrollOnCondition({
  condition,
  children,
  style,
  className,
  morePaddingTop,
  scrollRef,
  refreshControl,
}: {
  condition: boolean;
  children: ReactNode;
  style?: Object;
  className?: string;
  morePaddingTop?: boolean;
  scrollRef?: RefObject<ScrollView>;
  refreshControl?: ReactElement<RefreshControlProps>;
}) {
  try {
    if (scrollRef) {
      useScrollToTop(scrollRef);
    } else {
      scrollRef = useRef<ScrollView>(null);
      useScrollToTop(scrollRef);
    }
  } catch (error) {
    console.log(error);
  }

  if (condition) {
    return (
      <KeyboardAwareScrollView
        refreshControl={refreshControl}
        contentContainerStyle={[style, morePaddingTop && { paddingTop: 50 }]}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        className={`flex-1 ${className}`}
        extraHeight={100}
        ref={scrollRef as unknown as RefObject<KeyboardAwareScrollView>}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }
  return (
    <View
      style={[style, morePaddingTop && { paddingTop: 50 }]}
      className={`flex-1 ${className}`}
    >
      {children}
    </View>
  );
}
