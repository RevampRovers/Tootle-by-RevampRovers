import React, { useState } from 'react';
import { Alert,  TouchableOpacity, View } from 'react-native';
import AppCheckBox from '../AppCheckBox';
import TextArea from './TextArea ';
import AppButton from '../AppButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const cancelContent = [
  {
    id: 1,
    title: 'Waiting for a long time',
  },
  {
    id: 2,
    title: 'Unable to contact driver',
  },
  {
    id: 3,
    title: 'Driver denied going to destination',
  },
  {
    id: 4,
    title: 'Driver denied coming to pickup',
  },
  {
    id: 5,
    title: 'Wrong address shown',
  },
  {
    id: 6,
    title: 'The price is not reasonable',
  },
];

export default function CancelScreen() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  console.log(textAreaValue)
  const handleCheckboxChange = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  const handleSubmitPress = () => {
    Alert.alert(
      "We're so sad about your cancellation",
      "We will continue to improve our service & satisfy you on the next trip.",
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAwareScrollView 
    //   keyboardShouldPersistTaps="handled"
    >
        
    <View className='px-6 pt-5 bg-white h-full'>
        <View>
                {cancelContent.map((item) => (
                <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => handleCheckboxChange(item.id)}>
                    <AppCheckBox
                    key={item.id}
                    label={item.title}
                    value={item.id === selectedItem}
                    onValueChange={()=>{}}
                    />
                </TouchableOpacity>
            ))}
        </View>
        <View>
            <TextArea value={textAreaValue}
          onChangeText={(text) => setTextAreaValue(text)}
           />    
        </View>
        <AppButton
              textColor="text-white"
              title="Submit"
              className="bg-primary"
              onPress={handleSubmitPress}/>
    </View> 
    </KeyboardAwareScrollView>
  );
}
