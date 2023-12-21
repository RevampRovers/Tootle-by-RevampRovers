import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import routes from "./routes";
import defaultStyles from "../config/styles";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../config/colors";
// import TutorialsScreen from "../screens/TutorialsScreen";
// import NotificationsScreen from "../screens/NotificationsScreen";

export type HomeTabNavigatorParamList = {
  [routes.HOME]: undefined;
  [routes.SETTINGS]: undefined;
};

interface TabIconProps {
  color: string;
  size: number;
}

const tabToolsIcon = ({ color, size }: TabIconProps) => (
  <MaterialCommunityIcons color={color} name="car" size={size} />
);
const tabSettingsIcon = ({ color, size }: TabIconProps) => (
  <Ionicons name="md-settings-sharp" size={size} color={color} />
);

export default function HomeTabNavigator() {
  const Tab = createBottomTabNavigator<HomeTabNavigatorParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: defaultStyles.headerStyle,
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name={routes.HOME}
        options={{
          tabBarIcon: tabToolsIcon,
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name={routes.SETTINGS}
        options={{
          title: "Settings",
          tabBarIcon: tabSettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
}
