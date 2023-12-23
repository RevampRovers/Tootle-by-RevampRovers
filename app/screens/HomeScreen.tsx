import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Alert,
  Button,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import MapView, { MapMarker } from "react-native-maps";
import React, { useCallback, useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Linking } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import SquareItem from "../components/SquareItem";
import { toTitleCase } from "../utils/toTitleCase";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import { ListItemSeparator } from "../components/lists";
import NoPlacesFound from "../components/NoPlacesFound";
import ActivityIndicator from "../components/ActivityIndicator";
import { navigate } from "../navigation/routeNavigation";
import routes from "../navigation/routes";

enum ServiceType {
  BIKE = "BIKE",
  CAR = "CAR",
  DELIVERY = "DELIVERY",
}

enum ButtomSheetState {
  LOCATION_PICKER = "LOCATION_PICKER",
  PAYMENT_METHOD = "PAYMENT_METHOD",
  RIDE_FOUND = "RIDE_FOUND",
}

const imageMap = {
  [ServiceType.BIKE]: require("../assets/bike.png"),
  [ServiceType.CAR]: require("../assets/car.png"),
  [ServiceType.DELIVERY]: require("../assets/delivery.png"),
};

export default function HomeScreen() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [pickupLocationModelVisible, setPickupLocationModelVisible] =
    useState(false);
  const [destinationLocationModelVisible, setDestinationLocationModelVisible] =
    useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.BIKE);
  const [mapTouched, setMapTouched] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<Place | null>(null);
  const [pickupLocationInput, setPickupLocationInput] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<Place | null>(
    null
  );
  const [destinationLocationInput, setDestinationLocationInput] =
    useState<string>("");
  const [artificalLoading, setArtificalLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "eSewa">("Cash");

  const [buttomSheetState, setButtomSheetState] = useState<ButtomSheetState>(
    ButtomSheetState.LOCATION_PICKER
  );

  const snapPoints = useMemo(
    () =>
      buttomSheetState === ButtomSheetState.LOCATION_PICKER
        ? [340]
        : buttomSheetState === ButtomSheetState.PAYMENT_METHOD
        ? [280]
        : buttomSheetState === ButtomSheetState.RIDE_FOUND
        ? [320]
        : [0],
    [buttomSheetState]
  );

  useEffect(() => {
    if (pickupLocationModelVisible) {
      if (pickupLocation) {
        setPickupLocationInput(pickupLocation.title);
      } else {
        setPickupLocationInput("");
      }
    }
  }, [pickupLocationModelVisible]);

  useEffect(() => {
    if (destinationLocationModelVisible) {
      if (destinationLocation) {
        setDestinationLocationInput(destinationLocation.title);
      } else {
        setDestinationLocationInput("");
      }
    }
  }, [destinationLocationModelVisible]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (mapTouched) {
      bottomSheetRef.current?.snapToPosition(0);
    } else {
      timeout = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 250);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [mapTouched]);

  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          },
          {
            latitude: destinationLocation.latitude,
            longitude: destinationLocation.longitude,
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
    } else if (pickupLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        },
        zoom: 15,
      });
    } else if (destinationLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
        },
        zoom: 15,
      });
    }
  }, [pickupLocation, destinationLocation]);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const filteredPickupPlaces = useMemo(() => {
    return places.filter((place) => {
      return (
        place.title.toLowerCase().includes(pickupLocationInput.toLowerCase()) ||
        place.city.toLowerCase().includes(pickupLocationInput.toLowerCase())
      );
    });
  }, [pickupLocationInput]);

  const filteredDestinationPlaces = useMemo(() => {
    return places.filter((place) => {
      return (
        place.title
          .toLowerCase()
          .includes(destinationLocationInput.toLowerCase()) ||
        place.city
          .toLowerCase()
          .includes(destinationLocationInput.toLowerCase())
      );
    });
  }, [destinationLocationInput]);

  return (
    <Screen
      noSafeArea
      noKeyboardAwareScroll
      scrollRef={scrollRef}
      className="flex-1"
    >
      <View className="flex-1">
        <MapView
          initialCamera={{
            center: {
              latitude: 27.6933113,
              longitude: 85.3211291,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
          }}
          onTouchStart={() => {
            setMapTouched(true);
          }}
          onTouchEnd={() => {
            setMapTouched(false);
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
          {pickupLocation && (
            <MapMarker
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              pinColor="green"
            />
          )}
          {destinationLocation && (
            <MapMarker
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
            />
          )}
        </MapView>
        <BottomSheet
          keyboardBehavior="interactive"
          // overDragResistanceFactor={15}
          ref={bottomSheetRef}
          index={0}
          animateOnMount={true}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
        >
          <ActivityIndicator visible={artificalLoading} />
          {buttomSheetState === ButtomSheetState.LOCATION_PICKER && (
            <>
              <View className="m-3 flex-row justify-center rounded-xl bg-light p-2">
                {Object.values(ServiceType).map((type) => (
                  <TouchableOpacity
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
              <View className="px-5">
                <TouchableOpacity
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
              </View>
              <View className="flex-row gap-3 px-5 mt-0">
                <AppButton
                  title="Schedule Ride"
                  className="flex-1"
                  onPress={() => {
                    // bottomSheetRef.current?.snapTo(0);
                  }}
                />
                <AppButton
                  textColor="text-white"
                  title="Book Ride"
                  className="flex-1 bg-primary"
                  onPress={() => {
                    if (!pickupLocation && !destinationLocation) {
                      Alert.alert(
                        "Error",
                        "Please select pickup and drop location"
                      );
                      return;
                    }
                    setArtificalLoading(true);
                    setTimeout(() => {
                      setButtomSheetState(ButtomSheetState.PAYMENT_METHOD);
                      setArtificalLoading(false);
                    }, 500);
                  }}
                />
              </View>
            </>
          )}
          {buttomSheetState === ButtomSheetState.PAYMENT_METHOD && (
            <View className="px-5">
              <View className="flex-row items-center">
                <MaterialIcons
                  color={colors.primary}
                  name="my-location"
                  size={32}
                />
                <AppText className="ml-2">{pickupLocation?.title}</AppText>
              </View>
              <View className="py-3 flex-row items-center">
                <MaterialCommunityIcons
                  color={colors.primary}
                  name="map-marker"
                  size={32}
                />
                <AppText className="ml-2">{destinationLocation?.title}</AppText>
              </View>
              <ListItemSeparator />
              <View className="m-2 flex-row justify-between">
                <AppText className="text-xl">Payment Method</AppText>
                <AppText className="text-primary font-bold text-xl">
                  Rs. 200
                </AppText>
              </View>
              <View className="flex-row justify-center rounded-xl bg-light p-2">
                {["Cash" as const, "eSewa" as const].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setPaymentMethod(type);
                    }}
                    className={`${
                      paymentMethod === type ? "bg-primary" : ""
                    } rounded-lg p-2 px-4 flex-1 items-center justify-center`}
                  >
                    <AppText
                      className={`${
                        paymentMethod === type ? "text-white" : ""
                      } rounded-lg`}
                    >
                      {type}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row gap-3 mt-0">
                <AppButton
                  title="Back"
                  className="px-8"
                  onPress={() => {
                    setArtificalLoading(true);
                    setTimeout(() => {
                      setButtomSheetState(ButtomSheetState.LOCATION_PICKER);
                      setArtificalLoading(false);
                    }, 500);
                  }}
                />
                <AppButton
                  textColor="text-white"
                  title="Book Ride"
                  className="flex-1 bg-primary"
                  onPress={() => {
                    setArtificalLoading(true);
                    setTimeout(() => {
                      setButtomSheetState(ButtomSheetState.RIDE_FOUND);
                      setArtificalLoading(false);
                    }, 1000);
                  }}
                />
              </View>
            </View>
          )}
          {buttomSheetState === ButtomSheetState.RIDE_FOUND && (
            <View className="px-5">
              <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl">Driver is on the way</AppText>
                <AppText className="text-primary font-bold text-xl">
                  1:00
                </AppText>
              </View>
              <ListItemSeparator />
              <View className="my-2 py-1 flex-row justify-between">
                <View className="flex-1 flex-row items-center">
                  <Image
                    source={require("../assets/driverAvatar.png")}
                    resizeMode="contain"
                  />
                  <View className="px-3 flex-1">
                    <AppText className="text-xl">John Doe</AppText>
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
                    <View className="flex-row items-center">
                      <MaterialIcons
                        color={colors.yellow}
                        name="star"
                        size={16}
                      />
                      <AppText className="ml-1 text-mediumGray">4.5</AppText>
                    </View>
                  </View>
                  <Image
                    source={imageMap[serviceType]}
                    className="w-20 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
              <ListItemSeparator />
              <View className="m-2 mb-1 flex-row justify-between">
                <AppText className="text-xl">Payment Method</AppText>
                <AppText className="text-primary font-bold text-xl">
                  Rs. 200
                </AppText>
              </View>
              <AppText className="mb-2 text-primary font-bold mx-2 text-lg">
                {paymentMethod}
              </AppText>
              <ListItemSeparator />
              <View className="my-2 flex-row items-center">
                <AppButton
                  textColor="text-white"
                  title="Cancel Ride"
                  className="flex-1 bg-[#c93a3a]"
                  onPress={() => {
                    Alert.alert(
                      "Cancel Ride",
                      "Are you sure you want to cancel the ride?",
                      [
                        {
                          text: "No",
                          onPress: () => {},
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            setArtificalLoading(true);
                            setTimeout(() => {
                              setButtomSheetState(
                                ButtomSheetState.LOCATION_PICKER
                              );
                              setArtificalLoading(false);
                            }, 500);
                          },
                        },
                      ]
                    );
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      `tel:${Math.floor(Math.random() * 10000000000)}`
                    );
                  }}
                  className="items-center justify-center border-2 mx-2 rounded-full h-12 w-12 border-primary"
                >
                  <MaterialCommunityIcons
                    color={colors.primary}
                    name="phone"
                    size={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigate(routes.CHAT, {});
                  }}
                  className="items-center justify-center border-2 rounded-full h-12 w-12 border-primary"
                >
                  <MaterialCommunityIcons
                    color={colors.primary}
                    name="message"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheet>
        <Modal
          animationType="slide"
          visible={pickupLocationModelVisible}
          onRequestClose={() => {
            setPickupLocationModelVisible(false);
          }}
        >
          <View className="flex-1 pt-10">
            <View className="flex-row items-center pl-5 pr-2">
              <AppTextInput
                clearButtonMode="always"
                autoFocus
                label=""
                value={pickupLocationInput}
                onChangeText={(text) => {
                  setPickupLocationInput(text);
                }}
                className="flex-1 mr-2"
                placeholder="Pickup Location"
                icon="my-location"
                materialIcons
              />
              <Button
                color={colors.primary}
                title="Cancel"
                onPress={() => {
                  setPickupLocationModelVisible(false);
                }}
              />
            </View>
            <KeyboardAwareScrollView
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => {}} />
              }
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps="handled"
              keyboardOpeningTime={0}
            >
              {filteredPickupPlaces.length === 0 ? (
                <NoPlacesFound />
              ) : (
                <>
                  {filteredPickupPlaces.map((place, index) => (
                    <View key={place.id}>
                      {index !== 0 && <ListItemSeparator />}
                      <TouchableHighlight
                        onPress={() => {
                          setPickupLocation(place);
                          setPickupLocationModelVisible(false);
                        }}
                        underlayColor={colors.highlight}
                      >
                        <View className="px-5 py-3 flex-row items-center">
                          <MaterialCommunityIcons
                            // color={colors.primary}
                            name={"map-marker"}
                            size={32}
                          />
                          <View>
                            <AppText className="ml-2 text-base">
                              {place.title}
                            </AppText>
                            <AppText className="ml-2 text-mediumGray">
                              {place.city}
                            </AppText>
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View>
                  ))}
                </>
              )}
            </KeyboardAwareScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          visible={destinationLocationModelVisible}
          onRequestClose={() => {
            setDestinationLocationModelVisible(false);
          }}
        >
          <View className="flex-1 pt-10">
            <View className="flex-row items-center pl-5 pr-2">
              <AppTextInput
                clearButtonMode="always"
                autoFocus
                label=""
                value={destinationLocationInput}
                onChangeText={(text) => {
                  setDestinationLocationInput(text);
                }}
                className="flex-1 mr-2"
                placeholder="Drop Location"
                icon="map-marker"
              />
              <Button
                color={colors.primary}
                title="Cancel"
                onPress={() => {
                  setDestinationLocationModelVisible(false);
                }}
              />
            </View>
            {filteredDestinationPlaces.length === 0 && <NoPlacesFound />}
            <KeyboardAwareScrollView
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => {}} />
              }
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps="handled"
              keyboardOpeningTime={0}
            >
              {filteredDestinationPlaces.map((place, index) => (
                <View key={place.id}>
                  {index !== 0 && <ListItemSeparator />}
                  <TouchableHighlight
                    onPress={() => {
                      setDestinationLocation(place);
                      setDestinationLocationModelVisible(false);
                    }}
                    underlayColor={colors.highlight}
                  >
                    <View className="px-5 py-3 flex-row items-center">
                      <MaterialCommunityIcons
                        // color={colors.primary}
                        name={"map-marker"}
                        size={32}
                      />
                      <View>
                        <AppText className="ml-2 text-base">
                          {place.title}
                        </AppText>
                        <AppText className="ml-2 text-mediumGray">
                          {place.city}
                        </AppText>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              ))}
            </KeyboardAwareScrollView>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

type Place = {
  id: number;
  title: string;
  city: string;
  latitude: number;
  longitude: number;
};

const places: Place[] = [
  {
    id: 1,
    title: "St. Xavier's College",
    city: "Maitighar, Kathmandu",
    latitude: 27.6933113,
    longitude: 85.3211291,
  },
  {
    id: 2,
    title: "Boudhanath Stupa",
    city: "Boudha, Kathmandu",
    latitude: 27.721816,
    longitude: 85.361514,
  },
  {
    id: 3,
    title: "Swayambhunath Temple",
    city: "Swayambhu, Kathmandu",
    latitude: 27.714035,
    longitude: 85.290685,
  },
  {
    id: 4,
    title: "Durbar Square",
    city: "Hanuman Dhoka, Kathmandu",
    latitude: 27.7045,
    longitude: 85.3076,
  },
  {
    id: 5,
    title: "Pashupatinath Temple",
    city: "Pashupati, Kathmandu",
    latitude: 27.7109,
    longitude: 85.3483,
  },
  {
    id: 6,
    title: "Thamel Market",
    city: "Thamel, Kathmandu",
    latitude: 27.7162,
    longitude: 85.3132,
  },
  {
    id: 7,
    title: "Garden of Dreams",
    city: "Keshar Mahal, Kathmandu",
    latitude: 27.7127,
    longitude: 85.3205,
  },
  {
    id: 8,
    title: "Nagarkot Viewpoint",
    city: "Nagarkot, Kathmandu",
    latitude: 27.7154,
    longitude: 85.5241,
  },
  {
    id: 9,
    title: "Patan Durbar Square",
    city: "Patan, Kathmandu",
    latitude: 27.6644,
    longitude: 85.3188,
  },
  {
    id: 10,
    title: "Kopan Monastery",
    city: "Kopan, Kathmandu",
    latitude: 27.7654,
    longitude: 85.3666,
  },
];
