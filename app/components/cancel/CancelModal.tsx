import React, { useState } from "react";
import { Alert, Button, Modal, TouchableOpacity, View } from "react-native";
import AppCheckBox from "../AppCheckBox";
import TextArea from "./TextArea";
import AppButton from "../AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../config/colors";
import { ListItemSeparator } from "../lists";
import Constants from "expo-constants";

export enum ButtomSheetState {
  LOCATION_PICKER = "LOCATION_PICKER",
  PAYMENT_METHOD = "PAYMENT_METHOD",
  RIDE_FOUND = "RIDE_FOUND",
  RIDE_ONGOING = "RIDE_ONGOING",
  RIDE_COMPLETED = "RIDE_COMPLETED",
}

export enum RiderButtomSheetState {
  PASSENGER_REQUEST_LIST = "PASSENGER_REQUEST_LIST",
  RIDE_SELECTED = "RIDE_SELECTED",
  RIDE_ONGOING = "RIDE_ONGOING",
}

const cancelContent = [
  {
    id: 1,
    title: "Waiting for a long time",
  },
  {
    id: 2,
    title: "Unable to contact driver",
  },
  {
    id: 3,
    title: "Driver denied going to destination",
  },
  {
    id: 4,
    title: "Driver denied coming to pickup",
  },
  {
    id: 5,
    title: "Wrong address shown",
  },
  {
    id: 6,
    title: "The price is not reasonable",
  },
];

export default function CancelModal({
  resetInputs,
  modalOpen,
  setModalOpen,
  setButtomSheetState,
  setArtificalLoading,
}: {
  resetInputs: () => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  setButtomSheetState: (value: ButtomSheetState) => void;
  setArtificalLoading: (value: boolean) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  const handleCheckboxChange = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  const handleSubmitPress = () => {
    setArtificalLoading(true);
    setModalOpen(false);
    setTimeout(() => {
      setButtomSheetState(ButtomSheetState.LOCATION_PICKER);
      setArtificalLoading(false);
      setTextAreaValue("");
      setSelectedItem(null);
      resetInputs();
    }, 1000);
    Alert.alert(
      "We're so sad about your cancellation",
      "We will continue to improve our service & satisfy you on the next trip.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  return (
    <Modal
      animationType="slide"
      visible={modalOpen}
      onRequestClose={() => {
        setModalOpen(!modalOpen);
      }}
    >
      <View
        className="py-2 px-5 items-start"
        style={{
          paddingTop: Constants.statusBarHeight,
        }}
      >
        <Button
          aria-label="Cancel Popup"
          title="Cancel"
          color={colors.primary}
          onPress={() => setModalOpen(!modalOpen)}
        />
      </View>
      <ListItemSeparator />
      <KeyboardAwareScrollView className="px-5 py-2 bg-white h-full">
        <View className="pb-10">
          <View>
            {cancelContent.map((item) => (
              <TouchableOpacity
                accessibilityRole="checkbox"
                accessibilityState={{ selected: item.id === selectedItem }}
                key={item.id}
                activeOpacity={0.7}
                onPress={() => handleCheckboxChange(item.id)}
              >
                <AppCheckBox
                  key={item.id}
                  label={item.title}
                  value={item.id === selectedItem}
                  onValueChange={() => {}}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <TextArea
              value={textAreaValue}
              onChangeText={(text) => setTextAreaValue(text)}
            />
          </View>
          <AppButton
            textColor="text-white"
            title="Submit"
            className="bg-primary"
            onPress={handleSubmitPress}
          />
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
