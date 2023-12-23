import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Alert,
  Button,
  Image,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import MapView, { MapMarker } from "react-native-maps";
import React, { useCallback, useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import SquareItem from "../components/SquareItem";
import { toTitleCase } from "../utils/toTitleCase";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

enum ServiceType {
  BIKE = "BIKE",
  CAR = "CAR",
  DELIVERY = "DELIVERY",
}

const imageMap = {
  [ServiceType.BIKE]: require("../assets/bike.png"),
  [ServiceType.CAR]: require("../assets/car.png"),
  [ServiceType.DELIVERY]: require("../assets/delivery.png"),
};

export default function HomeScreen() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const mapRef = useRef<MapView>(null);

  const [pickupLocationModelVisible, setPickupLocationModelVisible] =
    useState(false);
  const [destinationLocationModelVisible, setDestinationLocationModelVisible] =
    useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.BIKE);

  const [mapTouched, setMapTouched] = useState(false);

  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [pickupLocationInput, setPickupLocationInput] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<string>("");
  const [destinationLocationInput, setDestinationLocationInput] =
    useState<string>("");

  useEffect(() => {
    if (pickupLocationModelVisible) {
      setPickupLocationInput(pickupLocation);
    }
  }, [pickupLocationModelVisible]);

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
    if (destinationLocationModelVisible) {
      setDestinationLocationInput(destinationLocation);
    }
  }, [destinationLocationModelVisible]);

  useEffect(() => {
    if (pickupLocationInput === "St. Xavier's College") {
      mapRef.current?.animateCamera({
        center: {
          latitude: 27.6933113,
          longitude: 85.3211291,
        },
        zoom: 16,
      });
    }
  }, [pickupLocationInput]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [340], []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  return (
    <Screen
      noSafeArea
      noKeyboardAwareScroll
      scrollRef={scrollRef}
      className="flex-1"
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <MapView
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
          {destinationLocation === "St. Xavier's College" && (
            <MapMarker
              coordinate={{ latitude: 27.6933113, longitude: 85.3211291 }}
              // image={{uri: 'custom_pin'}}
            />
          )}
        </MapView>
        {/* <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 300,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        ></View> */}
        <BottomSheet
          keyboardBehavior="interactive"
          // overDragResistanceFactor={15}
          ref={bottomSheetRef}
          index={0}
          animateOnMount={true}
          snapPoints={snapPoints}
          // onChange={handleSheetChanges}
        >
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
                value={pickupLocation}
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
                value={destinationLocation}
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
              title="Book Ride"
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
                // bottomSheetRef.current?.snapTo(0);
              }}
            />
          </View>
        </BottomSheet>
        <Modal
          animationType="slide"
          visible={pickupLocationModelVisible}
          onRequestClose={() => {
            setPickupLocationModelVisible(false);
          }}
        >
          <View className="flex-1 pt-10">
            <View className="flex-row items-center px-5">
              <AppTextInput
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
            <View className="flex-row items-center px-5">
              <AppTextInput
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
            <TouchableHighlight
              onPress={() => {
                setDestinationLocation("St. Xavier's College");
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
                    St. Xavier's College
                  </AppText>
                  <AppText className="ml-2 text-mediumGray">
                    Maitighar, Kathmandu
                  </AppText>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </Modal>

        {/* <BottomSheetThing /> */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
});
