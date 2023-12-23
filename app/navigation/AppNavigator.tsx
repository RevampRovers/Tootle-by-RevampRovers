import { createNativeStackNavigator } from "@react-navigation/native-stack";

import routes from "./routes";
import defaultStyles from "../config/styles";
import { animation } from "../config/animation";

import HomeTabNavigator, {
  HomeTabNavigatorParamList,
} from "./HomeTabNavigator";
import ChatScreen from "../screens/ChatScreen";
// import NotificationsScreen from "../screens/NotificationsScreen";

type HomeTabParamList = {
  [routes.HOME_TAB]: undefined;
  [routes.HOME]: undefined;
};

type MultiScreenParamList = {
  [routes.CHAT]: undefined;
};

type MultipleScreensParamList = {};

export type AppNavigatorParamList = HomeTabParamList &
  HomeTabNavigatorParamList &
  MultiScreenParamList &
  MultipleScreensParamList;

export default function AppNavigator() {
  const Stack = createNativeStackNavigator<AppNavigatorParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: defaultStyles.headerStyle,
        headerShown: false,
        animation,
      }}
    >
      {/* HomeTab */}
      <Stack.Screen component={HomeTabNavigator} name={routes.HOME_TAB} />
      {/* HomeTab End */}

      {/* Tools */}
      {/* Tools End */}

      {/* Multiple Screens */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: "Back",
        }}
        component={ChatScreen}
        name={routes.CHAT}
      />
      {/* Multiple Screens End */}
    </Stack.Navigator>
  );
}
