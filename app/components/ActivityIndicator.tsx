import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator as NativeActivityIndicator,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import colors from "../config/colors";

export default function ActivityIndicator({
  visible,
  className = "bg-white",
  style,
}: {
  visible: boolean;
  className?: string;
  style?: object;
}) {
  const [opaque, setOpaque] = useState(false);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      setOpaque(true);
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        setOpaque(false);
      }, 300);
    }
    AccessibilityInfo.announceForAccessibility(
      `Loading ${visible ? "started" : "finished"}`
    );
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!opaque) return null;

  return (
    <Animated.View
      style={[styles.container, animatedStyle, style]}
      className={className}
    >
      <NativeActivityIndicator
        size="large"
        color={colors.primary}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 50,
    height: "100%",
    width: "100%",
  },
});
