import {
  Alert,
  Image,
  Keyboard,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import MapView, { MapMarker, Polyline } from "react-native-maps";
import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Linking } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { toTitleCase } from "../utils/toTitleCase";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import { ListItemSeparator } from "../components/lists";
import ActivityIndicator from "../components/ActivityIndicator";
import { navigate } from "../navigation/routeNavigation";
import routes from "../navigation/routes";
import useDebounce from "../utils/useDebounce";
import CancelModal, {
  RiderBottomSheetState,
} from "../components/cancel/CancelModal";
import {
  Passenger,
  Place,
  leapfrogToSxcRoute,
  offers,
  passengers,
  places,
} from "../utils/constants";
import { RouteProp } from "@react-navigation/native";
import { HomeTabNavigatorParamList } from "../navigation/HomeTabNavigator";
import LocationPickerModal from "../components/LocationPickerModal";
import TextArea from "../components/cancel/TextArea";
import { ScrollView } from "react-native";

export default function HomeOfRiderScreen({
  route,
}: {
  route: RouteProp<HomeTabNavigatorParamList, routes.HOME_OF_RIDER>;
}) {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [dragValue, setDragValue] = useState<number>(0);

  const [mapTouched, setMapTouched] = useState(false);

  const [passengerListLength, setPassengerListLength] = useState<number>(1);
  const [artificalLoading, setArtificalLoading] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(
    null
  );

  const [buttomSheetState, setRiderButtomSheetState] =
    useState<RiderBottomSheetState>(
      RiderBottomSheetState.PASSENGER_REQUEST_LIST
    );

  const snapPoints = useMemo(
    () =>
      buttomSheetState === RiderBottomSheetState.PASSENGER_REQUEST_LIST
        ? [
            26 + 272 * passengerListLength < 700
              ? 26 + 272 * passengerListLength
              : 700,
          ]
        : buttomSheetState === RiderBottomSheetState.RIDE_SELECTED
        ? [406]
        : buttomSheetState === RiderBottomSheetState.RIDE_ONGOING
        ? [330]
        : [0],
    [buttomSheetState, passengerListLength]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (buttomSheetState === RiderBottomSheetState.PASSENGER_REQUEST_LIST) {
      setPassengerListLength(1);
      interval = setInterval(() => {
        setPassengerListLength((prev) =>
          prev < passengers.length ? prev + 1 : prev
        );
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [buttomSheetState]);

  useDebounce(
    () => {
      setMapTouched(false);
    },
    [dragValue],
    200
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (mapTouched) {
      Keyboard.dismiss();
      bottomSheetRef.current?.snapToPosition(0);
    } else {
      timeout = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 0);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [mapTouched]);

  useEffect(() => {
    if (
      selectedPassenger?.pickupLocation &&
      selectedPassenger?.destinationLocation
    ) {
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: selectedPassenger.pickupLocation.latitude,
            longitude: selectedPassenger.pickupLocation.longitude,
          },
          {
            latitude: selectedPassenger.destinationLocation.latitude,
            longitude: selectedPassenger.destinationLocation.longitude,
          },
        ],
        {
          edgePadding: {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100,
          },
        }
      );
    }
  }, [selectedPassenger]);

  return (
    <Screen noSafeArea noKeyboardAwareScroll className="flex-1">
      <View className="flex-1">
        <MapView
          accessibilityElementsHidden
          initialCamera={{
            center: {
              latitude: 27.6933113,
              longitude: 85.3211291,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
          }}
          onPanDrag={() => {
            setMapTouched(true);
            setDragValue(Math.random());
          }}
          ref={mapRef}
          mapPadding={{ top: 0, right: 0, bottom: 340, left: 0 }}
          style={{
            width: "100%",
            height: "100%",
          }}
          provider="google"
          showsCompass
          showsUserLocation
          showsMyLocationButton
        >
          {selectedPassenger?.pickupLocation && (
            <MapMarker
              key={selectedPassenger.pickupLocation.id}
              coordinate={{
                latitude: selectedPassenger.pickupLocation.latitude,
                longitude: selectedPassenger.pickupLocation.longitude,
              }}
              pinColor={colors.primary}
            />
          )}
          {selectedPassenger?.destinationLocation && (
            <MapMarker
              key={selectedPassenger.destinationLocation.id}
              coordinate={{
                latitude: selectedPassenger.destinationLocation.latitude,
                longitude: selectedPassenger.destinationLocation.longitude,
              }}
            />
          )}
          {selectedPassenger?.pickupLocation?.id === 11 &&
            selectedPassenger?.destinationLocation?.id === 1 && (
              <Polyline
                coordinates={
                  leapfrogToSxcRoute.map((coordinate) => ({
                    latitude: coordinate[1],
                    longitude: coordinate[0],
                  })) || []
                }
                strokeWidth={12}
                strokeColor="#4595ff"
              />
            )}
        </MapView>
        <View
          style={{
            paddingTop: Constants.statusBarHeight,
          }}
          className="absolute top-0 right-0"
        >
          <TouchableOpacity
            accessibilityRole="button"
            aria-label="Open SOS Menu"
            onPress={() => {
              navigate(routes.SOS, {});
            }}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3,

              elevation: 5,
            }}
            className="items-center h-14 w-14 justify-center rounded-full bg-white mr-2"
          >
            <MaterialCommunityIcons
              color={colors.primary}
              name="shield-account"
              size={28}
            />
          </TouchableOpacity>
        </View>

        <BottomSheet
          keyboardBlurBehavior="restore"
          keyboardBehavior="interactive"
          enableHandlePanningGesture
          ref={bottomSheetRef}
          index={0}
          animateOnMount={true}
          snapPoints={snapPoints}
        >
          <ActivityIndicator visible={artificalLoading} />
          {buttomSheetState ===
            RiderBottomSheetState.PASSENGER_REQUEST_LIST && (
            <ScrollView>
              {passengers.slice(0, passengerListLength).map((item, index) => (
                <PassengerCard
                  key={item.passengerName}
                  item={item}
                  index={index}
                  setArtificalLoading={setArtificalLoading}
                  setSelectedPassenger={setSelectedPassenger}
                  setRiderButtomSheetState={setRiderButtomSheetState}
                />
              ))}
            </ScrollView>
          )}
          {buttomSheetState === RiderBottomSheetState.RIDE_SELECTED && (
            <View className="px-5">
              <View className="mb-2 flex-row justify-center">
                <AppText className="text-xl">Picking Up</AppText>
              </View>
              <ListItemSeparator />
              <View className="my-2 py-1 flex-row justify-between">
                <View className="flex-1 flex-row items-center">
                  <Image
                    source={require("../assets/driverAvatar.png")}
                    resizeMode="contain"
                  />
                  <View accessible className="px-3 flex-1">
                    <AppText className="text-xl">
                      {selectedPassenger?.passengerName}
                    </AppText>
                    <View className="flex-row items-center">
                      <View>
                        <AppText className="text-mediumGray">
                          {selectedPassenger?.pickupLocation?.title}
                        </AppText>
                        <AppText className="text-mediumGray">
                          800m (5 mins away)
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <ListItemSeparator />
              <View className="m-2 mb-1 flex-row justify-between">
                <AppText className="text-xl">Payment Method</AppText>
                <AppText className="text-primary font-bold text-xl">
                  Rs. {selectedPassenger?.price}
                </AppText>
              </View>
              <View className="flex-row justify-center">
                <AppText className="flex-1 mb-2 text-primary font-bold mx-2 text-lg">
                  Cash
                </AppText>
              </View>

              <View className="my-2 flex-row items-start">
                <TouchableOpacity
                  accessibilityRole="button"
                  aria-label="Cancel Ride"
                  onPress={() => {
                    Alert.alert(
                      "Cancel Ride",
                      "Are you sure you want to cancel this ride?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            setArtificalLoading(true);
                            setTimeout(() => {
                              setArtificalLoading(false);
                              setRiderButtomSheetState(
                                RiderBottomSheetState.PASSENGER_REQUEST_LIST
                              );
                            }, 500);
                          },
                        },
                      ]
                    );
                  }}
                  className="items-center justify-center flex-1"
                >
                  <View className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-[#c93a3a]">
                    <MaterialCommunityIcons
                      color={colors.red}
                      name="close"
                      size={24}
                    />
                  </View>
                  <AppText className="text-center text-[#c93a3a] mt-2">
                    Cancel Ride
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  aria-label="View Note"
                  onPress={() => {}}
                  className="items-center justify-center flex-1"
                >
                  <View className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary">
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="note-text"
                      size={24}
                    />
                  </View>
                  <AppText className="text-center mt-2">View{"\n"}Note</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  aria-label="Messages"
                  onPress={() => {
                    navigate(routes.CHAT, {});
                  }}
                  className="items-center justify-center flex-1"
                >
                  <View className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary">
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="message"
                      size={24}
                    />
                  </View>
                  <AppText className="text-center mt-2">Messages</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  aria-label="Call"
                  onPress={() => {
                    Linking.openURL(
                      `tel:${Math.floor(Math.random() * 10000000000)}`
                    );
                  }}
                  className="items-center justify-center flex-1"
                >
                  <View className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary">
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="phone"
                      size={24}
                    />
                  </View>
                  <AppText className="text-center mt-2">Call</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  aria-label="Open in Google Maps"
                  onPress={() => {
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&origin=${selectedPassenger?.pickupLocation?.latitude},${selectedPassenger?.pickupLocation?.longitude}&destination=${selectedPassenger?.destinationLocation?.latitude},${selectedPassenger?.destinationLocation?.longitude}&travelmode=driving`
                    );
                  }}
                  className="items-center justify-center flex-1"
                >
                  <View className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary">
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="navigation"
                      size={24}
                    />
                  </View>
                  <AppText className="text-center mt-2">Navigate</AppText>
                </TouchableOpacity>
              </View>
              <AppButton
                color="bg-[#7bba89]"
                textColor="text-white"
                title="Pick Up"
                onPress={() => {
                  setArtificalLoading(true);
                  setTimeout(() => {
                    setArtificalLoading(false);
                    setRiderButtomSheetState(
                      RiderBottomSheetState.RIDE_ONGOING
                    );
                  }, 500);
                }}
              />
            </View>
          )}
          {buttomSheetState === RiderBottomSheetState.RIDE_ONGOING && (
            <View className="px-5">
              <View className="mb-2 flex-row justify-center">
                <AppText className="text-xl">Ride Ongoing</AppText>
              </View>
              <ListItemSeparator />
              <View className="my-2 py-1 flex-row justify-between">
                <View className="flex-1 flex-row items-center">
                  <Image
                    source={require("../assets/driverAvatar.png")}
                    resizeMode="contain"
                  />
                  <View accessible className="px-3 flex-1">
                    <AppText className="text-xl">
                      {selectedPassenger?.passengerName}
                    </AppText>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        color={colors.primary}
                        name="map-marker"
                        size={16}
                      />
                      <AppText className="ml-1 text-mediumGray">
                        800m (5 mins away)
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
              <ListItemSeparator />
              <View className="m-2 mb-1 flex-row justify-between">
                <AppText className="text-xl">Payment Method</AppText>
                <AppText className="text-primary font-bold text-xl">
                  Rs. {selectedPassenger?.price}
                </AppText>
              </View>
              <View className="flex-row justify-center">
                <AppText className="flex-1 mb-2 text-primary font-bold mx-2 text-lg">
                  Cash
                </AppText>
                <View className="my-2 flex-row items-center">
                  <TouchableOpacity
                    accessibilityRole="button"
                    aria-label="Share Ride Progress"
                    onPress={() => {
                      Share.share({
                        message: `I am on my way to ${selectedPassenger?.destinationLocation?.title} from ${selectedPassenger?.pickupLocation?.title}.`,
                      });
                    }}
                    className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary"
                  >
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="share-variant"
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    aria-label="Open in Google Maps"
                    onPress={() => {
                      Linking.openURL(
                        `https://www.google.com/maps/dir/?api=1&origin=${selectedPassenger?.pickupLocation?.latitude},${selectedPassenger?.pickupLocation?.longitude}&destination=${selectedPassenger?.destinationLocation?.latitude},${selectedPassenger?.destinationLocation?.longitude}&travelmode=driving`
                      );
                    }}
                    className="items-center justify-center border-2 rounded-full h-12 w-12 border-primary"
                  >
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="navigation"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <AppButton
                color="bg-[#7bba89]"
                textColor="text-white"
                title="Ride Completed"
                onPress={() => {
                  Alert.alert(
                    "Ride Completed",
                    "The ride was successfully marked as completed.",
                    [{ text: "OK" }],
                    { cancelable: false }
                  );
                  setArtificalLoading(true);
                  setTimeout(() => {
                    setArtificalLoading(false);
                    setRiderButtomSheetState(
                      RiderBottomSheetState.PASSENGER_REQUEST_LIST
                    );
                  }, 500);
                }}
              />
            </View>
          )}
        </BottomSheet>
      </View>
    </Screen>
  );
}

function PassengerCard({
  item,
  index,
  setArtificalLoading,
  setSelectedPassenger,
  setRiderButtomSheetState,
}: {
  item: Passenger;
  index: number;
  setArtificalLoading: (value: boolean) => void;
  setSelectedPassenger: (value: Passenger | null) => void;
  setRiderButtomSheetState: (value: RiderBottomSheetState) => void;
}) {
  const [currentPrice, setPaymentMethod] = useState<
    "Rs. 200" | "Rs. 220" | "Rs. 240"
  >("Rs. 200");
  return (
    <View key={item.passengerName}>
      {index !== 0 && (
        <View className="py-1">
          <ListItemSeparator />
        </View>
      )}
      <View className="mx-5">
        <AppText className="py-1 text-primary text-2xl font-bold">
          {item.passengerName}
        </AppText>
        <View accessible className="pt-1">
          <View className="pb-1 flex-row items-center">
            <MaterialIcons
              accessibilityLabel="Pickup Location"
              color={colors.primary}
              name="my-location"
              size={32}
            />
            <AppText className="ml-2">{item.pickupLocation?.title}</AppText>
          </View>
          <View className="pb-1 flex-row items-center">
            <MaterialCommunityIcons
              accessibilityLabel="Destination Location"
              color={colors.primary}
              name="map-marker"
              size={32}
            />
            <AppText className="ml-2">
              {item.destinationLocation?.title}
            </AppText>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          {[item.distance, "Cash Payment", `Rs. ${item.price}`].map((text) => (
            <AppText key={text} className="text-primary text-lg font-bold">
              {text}
            </AppText>
          ))}
        </View>

        <View className="mt-2 flex-row justify-center rounded-xl bg-light p-2">
          {["Rs. 200" as const, "Rs. 220" as const, "Rs. 240" as const].map(
            (price) => (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ selected: currentPrice === price }}
                key={price}
                onPress={() => {
                  setPaymentMethod(price);
                }}
                className={`${
                  currentPrice === price ? "bg-primary" : ""
                } rounded-lg p-2 px-4 flex-1 items-center justify-center`}
              >
                <AppText
                  className={`${
                    currentPrice === price ? "text-white" : ""
                  } rounded-lg`}
                >
                  {price}
                </AppText>
              </TouchableOpacity>
            )
          )}
        </View>
        <AppButton
          color="bg-[#7bba89]"
          textColor="text-white"
          title="Accept"
          onPress={() => {
            setArtificalLoading(true);
            setTimeout(() => {
              setSelectedPassenger(item);
              setArtificalLoading(false);
              setRiderButtomSheetState(RiderBottomSheetState.RIDE_SELECTED);
            }, 500);
          }}
        />
      </View>
    </View>
  );
}
