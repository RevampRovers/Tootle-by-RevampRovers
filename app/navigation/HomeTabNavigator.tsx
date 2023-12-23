import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import routes from "./routes";
import defaultStyles from "../config/styles";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import colors from "../config/colors";
import History2Screen from "../screens/History2Screen";
// import TutorialsScreen from "../screens/TutorialsScreen";
// import NotificationsScreen from "../screens/NotificationsScreen";

export type HomeTabNavigatorParamList = {
  [routes.HOME]: undefined;
  [routes.SETTINGS]: undefined;
  [routes.HISTORY]: undefined;
  [routes.HISTORY_2]: undefined;
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
const tabHistory = ({ color, size }: TabIconProps) => (
  <MaterialCommunityIcons color={color} name="history" size={size} />
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
          headerShown: false,
          tabBarIcon: tabToolsIcon,
        }}
      />
      <Tab.Screen
        component={HistoryScreen}
        name={routes.HISTORY}
        options={{
          title: "History",
          tabBarIcon: tabHistory,
        }}
      />
      <Tab.Screen
        component={History2Screen}
        name={routes.HISTORY_2}
        options={{
          title: "History2",
          tabBarIcon: tabHistory,
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
