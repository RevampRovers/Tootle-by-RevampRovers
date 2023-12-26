import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import MapView, { MapMarker, Polyline } from "react-native-maps";
import React, { useCallback, useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
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

export default function HomeScreen() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
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
  const [pickupLocation, setPickupLocation] = useState<Place | null>(
    places.find((place) => place.id === 11) || null
  );
  const [ridePriceInput, setRidePriceInput] = useState<string>("200");
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

  useDebounce(
    () => {
      setMapTouched(false);
    },
    [dragValue],
    200
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
              coordinate={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
              }}
              pinColor={colors.primary}
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
          {pickupLocation?.id === 11 && destinationLocation?.id === 1 && (
            <Polyline
              coordinates={
                [
                  [85.327246, 27.707435],
                  [85.327215, 27.707302],
                  [85.327208, 27.707278],
                  [85.327168, 27.707064],
                  [85.327162, 27.70704],
                  [85.327025, 27.706492],
                  [85.326924, 27.706166],
                  [85.326849, 27.705877],
                  [85.326845, 27.705858],
                  [85.326776, 27.705362],
                  [85.326521, 27.705349],
                  [85.326287, 27.705371],
                  [85.326156, 27.705388],
                  [85.325535, 27.705472],
                  [85.325132, 27.705511],
                  [85.32461, 27.705566],
                  [85.324199, 27.705632],
                  [85.324148, 27.705628],
                  [85.324061, 27.705618],
                  [85.323962, 27.705621],
                  [85.32287, 27.705647],
                  [85.322824, 27.705021],
                  [85.322758, 27.704648],
                  [85.322746, 27.704572],
                  [85.322662, 27.703998],
                  [85.322609, 27.703692],
                  [85.322516, 27.703087],
                  [85.322485, 27.70282],
                  [85.322427, 27.702414],
                  [85.322393, 27.70217],
                  [85.322382, 27.702091],
                  [85.32237, 27.702006],
                  [85.322352, 27.701879],
                  [85.322301, 27.701606],
                  [85.322182, 27.700999],
                  [85.322174, 27.700839],
                  [85.322132, 27.700648],
                  [85.322074, 27.700379],
                  [85.321923, 27.699683],
                  [85.32179, 27.699086],
                  [85.321719, 27.698769],
                  [85.32169, 27.69863],
                  [85.321662, 27.69849],
                  [85.321643, 27.698409],
                  [85.321543, 27.69809],
                  [85.321412, 27.69751],
                  [85.3212, 27.696566],
                  [85.321048, 27.695921],
                  [85.320957, 27.695485],
                  [85.320876, 27.695132],
                  [85.320863, 27.695065],
                  [85.320846, 27.69499],
                  [85.320737, 27.694546],
                  [85.320722, 27.6945],
                  [85.320687, 27.694418],
                  [85.320645, 27.694353],
                  [85.320597, 27.694304],
                  [85.320545, 27.694269],
                  [85.320491, 27.694246],
                  [85.320437, 27.694233],
                  [85.320385, 27.694228],
                  [85.320336, 27.694229],
                  [85.320293, 27.694234],
                  [85.320256, 27.694241],
                  [85.320229, 27.694249],
                  [85.320213, 27.694256],
                  [85.31998, 27.694362],
                  [85.31996, 27.69437],
                  [85.319948, 27.694375],
                  [85.319935, 27.694379],
                  [85.319917, 27.694385],
                  [85.319892, 27.694392],
                  [85.319863, 27.694397],
                  [85.319828, 27.6944],
                  [85.319789, 27.694399],
                  [85.319746, 27.694392],
                  [85.319766, 27.69438],
                  [85.319793, 27.694338],
                  [85.319815, 27.694303],
                  [85.319867, 27.694256],
                  [85.319931, 27.694181],
                  [85.320178, 27.69392],
                  [85.320312, 27.693798],
                  [85.320457, 27.693664],
                  [85.320464, 27.693635],
                  [85.320473, 27.693608],
                  [85.320425, 27.69346],
                  [85.320448, 27.693423],
                  [85.320463, 27.693398],
                  [85.320593, 27.693335],
                  [85.320714, 27.693283],
                  [85.320871, 27.693262],
                  [85.320921, 27.693241],
                ].map((coordinate) => ({
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
                    // bottomSheetRef.current?.snapTo(0);
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
          setModalOpen={setCancelModalOpen}
          modalOpen={cancelModalOpen}
          setButtomSheetState={setButtomSheetState}
          setArtificalLoading={setArtificalLoading}
        />
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
  {
    id: 11,
    title: "Leapfrog Technology Inc.",
    city: "Charkhal Rd, Kathmandu",
    latitude: 27.7074128,
    longitude: 85.3273696,
  },
];
