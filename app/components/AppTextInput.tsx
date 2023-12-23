import { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import colors from "../config/colors";

export interface MainInputProps extends TextInputProps {
  icon?: string;
  my0?: boolean;
  children?: ReactNode;
  onPress?: () => void;
  materialIcons?: boolean;
  passwordField?: boolean;
  setSecureTextEntry?: (value: boolean) => void;
  textClassName?: string;
  noBorder?: boolean;
}

export interface AppTextInputProps extends MainInputProps {
  label?: string;
}

function MainInput({
  icon,
  my0,
  children,
  passwordField,
  textClassName = "flex-1 p-3 px-4 bg-white",
  noBorder,
  materialIcons,
  ...otherProps
}: MainInputProps) {
  return (
    <View
      className={`${
        noBorder ? "" : "border-primary border-2"
      } flex-row items-center justify-center overflow-hidden rounded-xl ${
        my0 ? "my-0" : "my-2"
      }`}
    >
      {icon && (
        <View className="ml-3">
          {materialIcons ? (
            <MaterialIcons
              color={colors.primary}
              name={icon as any}
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              color={colors.primary}
              name={icon as any}
              size={20}
            />
          )}
        </View>
      )}
      {children || (
        <TextInput
          placeholderTextColor={colors.mediumGray}
          style={[defaultStyles.text]}
          className={`${textClassName} ${icon ? "px-3" : ""}`}
          {...otherProps}
        />
      )}

      {passwordField && (
        <TouchableOpacity
          onPress={() => {
            otherProps.setSecureTextEntry?.(!otherProps.secureTextEntry);
          }}
          className="mx-2"
        >
          <MaterialCommunityIcons
            color={colors.mediumGray}
            name={otherProps.secureTextEntry ? "eye-off" : "eye"}
            size={20}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function AppTextInput({
  label,
  onPress,
  my0,
  children,
  style,
  ...otherProps
}: AppTextInputProps) {
  return (
    <View style={style}>
      {label ? (
        <AppText className="text-mediumGray mx-3 mt-2 text-sm">{label}</AppText>
      ) : null}
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <MainInput my0={my0} accessibilityLabel={label} {...otherProps}>
            {children}
          </MainInput>
        </TouchableOpacity>
      ) : (
        <MainInput my0={my0} accessibilityLabel={label} {...otherProps}>
          {children}
        </MainInput>
      )}
    </View>
  );
}
