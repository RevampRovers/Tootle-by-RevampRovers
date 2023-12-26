import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AppText from '../components/AppText';
import { toTitleCase } from '../utils/toTitleCase';
import UpcomingContent from '../components/history/UpcomingContent';
import CompletedContent from '../components/history/CompletedContent';
import CancelledContent from '../components/history/CancelledContent';

enum ServiceType {
  UPCOMING = "Upcoming",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

const HistoryScreen = () => {
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.UPCOMING);

  const tabContents: { [key in ServiceType]: React.ReactNode } = {
    [ServiceType.UPCOMING]: <UpcomingContent />,
    [ServiceType.COMPLETED]: <CompletedContent />,
    [ServiceType.CANCELLED]: <CancelledContent />,
  };

  return (
    <View className='bg-white '>
      <View className="m-3 flex-row justify-center rounded-xl bg-light border-primary " style={{borderWidth: 1}}>
        {Object.values(ServiceType).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setServiceType(type);
            }}
            className={
                `${
              serviceType === type ?
               "bg-primary" : ""
            } 
            rounded-lg p-2 px-4 py-4 flex-1 items-center justify-center ` }
          >
     
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
        {tabContents[serviceType]}
    </View>
  );
};


export default HistoryScreen;
