import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import routes from "./routes";
import defaultStyles from "../config/styles";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import colors from "../config/colors";
import OffersScreen from "../screens/OffersScreen";
import { Promo } from "../utils/constants";

export type HomeTabNavigatorParamList = {
  [routes.HOME]: {
    promo: Promo | null;
  };
  [routes.SETTINGS]: undefined;
  [routes.HISTORY]: undefined;
  [routes.OFFERS]: undefined;
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

const tabHistoryIcon = ({ color, size }: TabIconProps) => (
  <MaterialCommunityIcons color={color} name="history" size={size} />
);

const tabOfferIcon = ({ color, size }: TabIconProps) => (
  <MaterialCommunityIcons color={color} name="shopping" size={size} />
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
        initialParams={{
          promo: null,
        }}
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
          tabBarIcon: tabHistoryIcon,
        }}
      />
      <Tab.Screen
        component={OffersScreen}
        name={routes.OFFERS}
        options={{
          title: "Promos",
          headerTitle: "Offers and Promos",
          tabBarIcon: tabOfferIcon,
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
