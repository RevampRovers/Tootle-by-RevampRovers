import { ReactNode } from "react";
import { TouchableHighlight, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import { ListItemSeparator } from "./lists";
import { ListTitle } from "./ListTitle";
import colors from "../config/colors";

export default function AppListItems({
  items,
}: {
  items: {
    name: string;
    options: {
      title: string;
      loading?: boolean;
      titleClassName?: string;
      loadingTitle?: string;
      subTitle?: string | ReactNode;
      onPress?: () => void;
      dropdown?: boolean;
    }[];
  }[];
}) {
  return (
    <>
      {items.map(({ name, options }) =>
        options.length > 0 ? (
          <View key={name}>
            {name ? <ListTitle name={name} /> : null}
            <View className="overflow-hidden rounded-lg bg-white">
              {options.map(
                (
                  {
                    title,
                    subTitle,
                    loading,
                    loadingTitle,
                    onPress,
                    dropdown,
                    titleClassName,
                  },
                  index
                ) => (
                  <View key={title}>
                    {dropdown ? (
                      subTitle
                    ) : (
                      <TouchableHighlight
                        disabled={!!loading}
                        underlayColor={colors.highlight}
                        onPress={!loading && onPress ? onPress : undefined}
                        accessibilityRole={
                          !loading && onPress ? "button" : "text"
                        }
                        className={`${loading ? "opacity-50" : ""}`}
                      >
                        <View className="flex-row items-center justify-between pr-4">
                          <AppText
                            className={`flex-1 py-3 pl-5 text-base ${titleClassName}`}
                          >
                            {loading ? loadingTitle : title}
                          </AppText>
                          {subTitle && (
                            <>
                              {typeof subTitle === "string" ? (
                                <AppText className="text-mediumGray flex-1 justify-center py-3 pr-5 text-right text-base">
                                  {subTitle}
                                </AppText>
                              ) : (
                                <View className="py-3 pr-5">{subTitle}</View>
                              )}
                            </>
                          )}
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={colors.mediumGray}
                          />
                        </View>
                      </TouchableHighlight>
                    )}
                    {index < options.length - 1 ? (
                      <View className="pl-5">
                        <ListItemSeparator />
                      </View>
                    ) : null}
                  </View>
                )
              )}
            </View>
          </View>
        ) : null
      )}
    </>
  );
}
