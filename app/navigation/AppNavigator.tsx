import { createNativeStackNavigator } from "@react-navigation/native-stack";

import routes from "./routes";
import defaultStyles from "../config/styles";
import { animation } from "../config/animation";

import HomeTabNavigator, {
  HomeTabNavigatorParamList,
} from "./HomeTabNavigator";
// import NotificationsScreen from "../screens/NotificationsScreen";

type HomeTabParamList = {
  [routes.HOME_TAB]: undefined;
};

type ToolsParamList = {
  [routes.HOME]: undefined;
};

type MultipleScreensParamList = {};

export type AppNavigatorParamList = HomeTabParamList &
  HomeTabNavigatorParamList &
  ToolsParamList &
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
      {/* Multiple Screens End */}
    </Stack.Navigator>
  );
}
