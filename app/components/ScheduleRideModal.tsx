import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import routes from "../navigation/routes";
import { AppNavigatorParamList } from "../navigation/AppNavigator";
import AppButton from "./AppButton";
import TextArea from "./cancel/TextArea";
import colors from "../config/colors";
import Screen from "./Screen";
import { RouteProp } from "@react-navigation/native";
import { Place, places } from "../utils/constants";
import ActivityIndicator from "./ActivityIndicator";
import LocationPickerModal from "./LocationPickerModal";
import AppText from "./AppText";
import { toTitleCase } from "../utils/toTitleCase";
import AppTextInput from "./AppTextInput";
import AppDatePicker from "./AppDatePicker";
import AppTimePicker from "./AppTimePicker";

enum ScheduleServiceType {
  BIKE = "BIKE",
  CAR = "CAR",
  BUS = "BUS",
}

const imageMap = {
  [ScheduleServiceType.BIKE]: require("../assets/bike.png"),
  [ScheduleServiceType.CAR]: require("../assets/car.png"),
  [ScheduleServiceType.BUS]: require("../assets/bus.png"),
};

export default function ScheduleRideScreen({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<
    AppNavigatorParamList,
    routes.SCHEDULE_RIDE
  >;
  route: RouteProp<AppNavigatorParamList, routes.SCHEDULE_RIDE>;
}) {
  const {
    serviceType: _serviceType,
    pickupLocation: _pickupLocation,
    destinationLocation: _destinationLocation,
  } = route.params || {};

  const [pickupLocationModelVisible, setPickupLocationModelVisible] =
    useState(false);
  const [destinationLocationModelVisible, setDestinationLocationModelVisible] =
    useState(false);
  const [serviceType, setServiceType] = useState<ScheduleServiceType>(
    ScheduleServiceType.BIKE
  );
  const [pickupLocation, setPickupLocation] = useState<Place | null>(
    places.find((place) => place.id === 11) || null
  );
  const [pickupLocationInput, setPickupLocationInput] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<Place | null>(
    null
  );
  const [destinationLocationInput, setDestinationLocationInput] =
    useState<string>("");

  useEffect(() => {
    if (
      _serviceType &&
      Object.values(ScheduleServiceType).includes(_serviceType)
    ) {
      setServiceType(_serviceType);
    } else {
      setServiceType(ScheduleServiceType.BIKE);
    }
  }, [_serviceType]);

  useEffect(() => {
    if (_pickupLocation) {
      setPickupLocation(_pickupLocation);
    }
  }, [_pickupLocation]);

  useEffect(() => {
    if (_destinationLocation) {
      setDestinationLocation(_destinationLocation);
    }
  }, [_destinationLocation]);

  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [artificalLoading, setArtificalLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [time, setTime] = useState<Date>(new Date());

  const handleSubmitPress = () => {
    setArtificalLoading(true);
    setTimeout(() => {
      setArtificalLoading(false);
      Alert.alert(
        "Your request has been sent!",
        "You will be notified when the driver accepts your ride.",
        [
          {
            text: "OK",
          },
        ]
      );
      navigation.goBack();
    }, 1000);
  };

  return (
    <>
      <ActivityIndicator visible={artificalLoading} />
      <Screen backgroundColor="white" className="p-5">
        <View>
          <View className="m-3 flex-row justify-center rounded-xl bg-light p-2">
            {Object.values(ScheduleServiceType).map((type) => (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ selected: serviceType === type }}
                key={type}
                onPress={() => {
                  setServiceType(type);
                }}
                className={`${
                  serviceType === type ? "bg-primary" : ""
                } rounded-lg p-2 px-4 flex-1 items-center justify-center`}
              >
                <Image
                  source={imageMap[type]}
                  className="mb-1 w-20 h-10"
                  resizeMode="contain"
                />
                <AppText
                  className={`${
                    serviceType === type ? "text-white" : ""
                  } rounded-lg`}
                >
                  {toTitleCase(type)}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            aria-label="Pickup Location"
            accessibilityValue={{
              text: pickupLocation?.title || "Not set",
            }}
            accessibilityRole="button"
            onPress={() => {
              setPickupLocationModelVisible(true);
            }}
          >
            <AppTextInput
              value={pickupLocation?.title}
              pointerEvents="none"
              label=""
              placeholder="Pickup Location"
              icon="my-location"
              materialIcons
            />
          </TouchableOpacity>
          <TouchableOpacity
            aria-label="Destination Location"
            accessibilityValue={{
              text: destinationLocation?.title || "Not set",
            }}
            accessibilityRole="button"
            onPress={() => {
              setDestinationLocationModelVisible(true);
            }}
          >
            <AppTextInput
              value={destinationLocation?.title}
              pointerEvents="none"
              label=""
              placeholder="Drop Location"
              icon="map-marker"
              onPress={() => {
                setDestinationLocationModelVisible(true);
              }}
            />
          </TouchableOpacity>
          <AppDatePicker
            date={date}
            label=""
            placeholder="Drop Location"
            icon="calendar"
            onDateChange={(newDate) => {
              setDate(newDate);
            }}
            minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            maximumDate={undefined}
          />
          <AppTimePicker
            time={time}
            label=""
            placeholder="Drop Location"
            icon="calendar"
            onTimeChange={(newTime) => {
              setTime(newTime);
            }}
          />
          <View>
            <TextArea
              placeholder="Comment.."
              value={textAreaValue}
              onChangeText={(text) => setTextAreaValue(text)}
            />
          </View>
          <AppButton
            textColor="text-white"
            title="Request Ride"
            className="bg-primary"
            onPress={handleSubmitPress}
          />
          <LocationPickerModal
            location={pickupLocation}
            setLocation={setPickupLocation}
            textInput={pickupLocationInput}
            setTextInput={setPickupLocationInput}
            modalVisible={pickupLocationModelVisible}
            setModalVisible={setPickupLocationModelVisible}
          />
          <LocationPickerModal
            location={destinationLocation}
            setLocation={setDestinationLocation}
            textInput={destinationLocationInput}
            setTextInput={setDestinationLocationInput}
            modalVisible={destinationLocationModelVisible}
            setModalVisible={setDestinationLocationModelVisible}
          />
        </View>
      </Screen>
    </>
  );
}
