import React, { useState } from "react";
import { Alert, Button, Modal, TouchableOpacity, View } from "react-native";
import AppCheckBox from "../AppCheckBox";
import TextArea from "./TextArea";
import AppButton from "../AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../config/colors";

export enum ButtomSheetState {
  LOCATION_PICKER = "LOCATION_PICKER",
  PAYMENT_METHOD = "PAYMENT_METHOD",
  RIDE_FOUND = "RIDE_FOUND",
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
  modalOpen,
  setModalOpen,
  setButtomSheetState,
  setArtificalLoading,
}: {
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
      <KeyboardAwareScrollView className="px-5 pt-10 bg-white h-full">
        <View className="py-2 items-start">
          <Button
            title="Cancel"
            color={colors.primary}
            onPress={() => setModalOpen(!modalOpen)}
          />
        </View>
        <View>
          <View>
            {cancelContent.map((item) => (
              <TouchableOpacity
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