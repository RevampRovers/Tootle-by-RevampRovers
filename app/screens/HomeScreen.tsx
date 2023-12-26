import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  Modal,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import MapView, { MapMarker, Polyline } from "react-native-maps";
import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
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
import useDebounce from "../utils/useDebounce";
import CancelModal, {
  ButtomSheetState,
} from "../components/cancel/CancelModal";
import { Place, leapfrogToSxcRoute, offers, places } from "../utils/constants";
import { RouteProp } from "@react-navigation/native";
import { AppNavigatorParamList } from "../navigation/AppNavigator";
import { HomeTabNavigatorParamList } from "../navigation/HomeTabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LocationPickerModal from "../components/LocationPickerModal";

enum ServiceType {
  BIKE = "BIKE",
  CAR = "CAR",
  DELIVERY = "DELIVERY",
}

enum NotePromoChoice {
  NOTE = "NOTE",
  PROMO = "PROMO",
}

const imageMap = {
  [ServiceType.BIKE]: require("../assets/bike.png"),
  [ServiceType.CAR]: require("../assets/car.png"),
  [ServiceType.DELIVERY]: require("../assets/delivery.png"),
};

export default function HomeScreen({
  route,
}: {
  route: RouteProp<HomeTabNavigatorParamList, routes.HOME>;
}) {
  const { promo } = route.params || {};

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetTextInputRef = useRef<BottomSheet>(null);
  const [dragValue, setDragValue] = useState<number>(0);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [notePromo, setNotePromo] = useState<NotePromoChoice | null>(null);
  const [promoInput, setPromoInput] = useState<string>("");
  const [noteInput, setNoteInput] = useState<string>("");
  const [pickupLocationModelVisible, setPickupLocationModelVisible] =
    useState(false);
  const [destinationLocationModelVisible, setDestinationLocationModelVisible] =
    useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.BIKE);
  const [mapTouched, setMapTouched] = useState(false);
  const [ridePriceInput, setRidePriceInput] = useState<string>("200");
  const [pickupLocation, setPickupLocation] = useState<Place | null>(
    places.find((place) => place.id === 11) || null
  );
  const [pickupLocationInput, setPickupLocationInput] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<Place | null>(
    null
  );
  const [destinationLocationInput, setDestinationLocationInput] =
    useState<string>("");
  const [artificalLoading, setArtificalLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Khalti" | "Business"
  >("Cash");

  const [buttomSheetState, setButtomSheetState] = useState<ButtomSheetState>(
    ButtomSheetState.LOCATION_PICKER
  );

  useEffect(() => {
    if (promo) {
      setPromoInput(promo.code);
    }
  }, [promo]);

  useDebounce(
    () => {
      setMapTouched(false);
    },
    [dragValue],
    50
  );

  const snapPoints = useMemo(
    () =>
      buttomSheetState === ButtomSheetState.LOCATION_PICKER
        ? [340]
        : buttomSheetState === ButtomSheetState.PAYMENT_METHOD
        ? [400]
        : buttomSheetState === ButtomSheetState.RIDE_FOUND
        ? [320]
        : [0],
    [buttomSheetState]
  );
  const snapPointsTextInput = [1, 200];

  useEffect(() => {
    if (notePromo) {
      bottomSheetTextInputRef.current?.snapToIndex(1);
    } else {
      bottomSheetTextInputRef.current?.close();
    }
  }, [notePromo]);

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

  const resetInputs = useCallback(() => {
    setPickupLocationInput("");
    setDestinationLocationInput("");
    setPickupLocation(places.find((place) => place.id === 11) || null);
    setDestinationLocation(null);
    setRidePriceInput("200");
    setPaymentMethod("Cash");
    setNoteInput("");
    setPromoInput("");
  }, []);

  return (
    <Screen noSafeArea noKeyboardAwareScroll className="flex-1">
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
          {pickupLocation && (
            <MapMarker
              key={pickupLocation.id}
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              pinColor={colors.primary}
            />
          )}
          {destinationLocation && (
            <MapMarker
              key={destinationLocation.id}
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
            />
          )}
          {pickupLocation?.id === 11 && destinationLocation?.id === 1 && (
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
        <BottomSheet
          keyboardBlurBehavior="restore"
          // enableDynamicSizing
          keyboardBehavior="interactive"
          enableHandlePanningGesture
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
                    navigate(routes.SCHEDULE_RIDE, {
                      serviceType,
                      pickupLocation,
                      destinationLocation,
                    });
                  }}
                />
                <AppButton
                  textColor="text-white"
                  title="Book Ride"
                  className="flex-1 bg-primary"
                  onPress={() => {
                    if (!pickupLocation || !destinationLocation) {
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
              <View className="flex-row gap-2">
                <AppButton
                  className="flex-1"
                  title={`Note ${noteInput ? "✓" : ""}`}
                  onPress={() => {
                    setNotePromo(NotePromoChoice.NOTE);
                  }}
                />
                <AppButton
                  className="flex-1"
                  title={`Promo ${promoInput ? "✓" : ""}`}
                  onPress={() => {
                    setNotePromo(NotePromoChoice.PROMO);
                  }}
                />
              </View>
              <ListItemSeparator />
              <View className="m-2 mb-0 flex-row justify-between">
                <AppText className="text-xl">Payment</AppText>
              </View>
              <AppTextInput
                onFocus={() => bottomSheetRef.current?.snapToPosition(660)}
                onBlur={() => bottomSheetRef.current?.snapToIndex(0)}
                placeholder="Offer your fair"
                value={ridePriceInput}
                onChangeText={(text) => {
                  setRidePriceInput(text);
                }}
              />

              <View className="mt-2 flex-row justify-center rounded-xl bg-light p-2">
                {["Cash" as const, "Khalti" as const, "Business" as const].map(
                  (type) => (
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
                  )
                )}
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
                  Rs. {ridePriceInput}
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
                    setCancelModalOpen(true);
                    // Alert.alert(
                    //   "Cancel Ride",
                    //   "Are you sure you want to cancel the ride?",
                    //   [
                    //     {
                    //       text: "No",
                    //       onPress: () => {},
                    //     },
                    //     {
                    //       text: "Yes",
                    //       onPress: () => {
                    //         setArtificalLoading(true);
                    //         setTimeout(() => {
                    //           setButtomSheetState(
                    //             ButtomSheetState.LOCATION_PICKER
                    //           );
                    //           setArtificalLoading(false);
                    //         }, 500);
                    //       },
                    //     },
                    //   ]
                    // );
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
        {buttomSheetState === ButtomSheetState.PAYMENT_METHOD ? (
          <BottomSheet
            ref={bottomSheetTextInputRef}
            index={0}
            onChange={(index: number) => {
              if (index === 0 || index === -1) {
                if (promoInput && notePromo === NotePromoChoice.PROMO) {
                  const offer = offers.find(
                    (offer) => offer.code === promoInput
                  )?.code;
                  if (!offer) {
                    Alert.alert("Invalid Promo Code");
                    setPromoInput("");
                  }
                }
                setNotePromo(null);
              }
            }}
            snapPoints={snapPointsTextInput}
            enableDynamicSizing={false}
            backdropComponent={(props) => {
              return (
                <BottomSheetBackdrop
                  {...props}
                  opacity={0.5}
                  disappearsOnIndex={0}
                  appearsOnIndex={1}
                />
              );
            }}
          >
            <View className="px-5">
              {notePromo === NotePromoChoice.NOTE ? (
                <>
                  <View className="m-2 mb-0 flex-row justify-between">
                    <AppText className="text-xl">Add a Note</AppText>
                  </View>
                  <AppTextInput
                    autoFocus
                    onFocus={() =>
                      bottomSheetTextInputRef.current?.snapToPosition(460)
                    }
                    onBlur={() =>
                      bottomSheetTextInputRef.current?.snapToIndex(0)
                    }
                    placeholder="Note"
                    value={noteInput}
                    onChangeText={(text) => {
                      setNoteInput(text);
                    }}
                  />
                </>
              ) : null}
              {notePromo === NotePromoChoice.PROMO ? (
                <>
                  <View className="m-2 mb-0 flex-row justify-between">
                    <AppText className="text-xl">Add a Promo Code</AppText>
                  </View>
                  <AppTextInput
                    autoFocus
                    onFocus={() =>
                      bottomSheetTextInputRef.current?.snapToPosition(460)
                    }
                    onBlur={() =>
                      bottomSheetTextInputRef.current?.snapToIndex(0)
                    }
                    placeholder="Promo Code"
                    value={promoInput}
                    onChangeText={(text) => {
                      setPromoInput(text);
                    }}
                  />
                </>
              ) : null}
              <AppButton
                title="Done"
                color="bg-primary"
                textColor="text-white"
                onPress={() => {
                  bottomSheetTextInputRef.current?.snapToIndex(0);
                  Keyboard.dismiss();
                }}
              />
            </View>
          </BottomSheet>
        ) : null}

        <CancelModal
          resetInputs={resetInputs}
          setModalOpen={setCancelModalOpen}
          modalOpen={cancelModalOpen}
          setButtomSheetState={setButtomSheetState}
          setArtificalLoading={setArtificalLoading}
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
  );
}
