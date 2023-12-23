import { View, Text } from 'react-native'
import React from 'react'
import colors from '../../config/colors'
import { MaterialIcons } from "@expo/vector-icons";

const ActivityContent = ({activity}) => {

    const formatDateTime = (dateTime: string): string => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(dateTime));
      
        return formattedDate;
      };

  return (
    <View 
        key={activity.id} 
        className='my-2 border-primary rounded-xl px-3 py-3' 
        style={{borderWidth: 1}}>
            <View 
             className='flex flex-row justify-between items-center'>
                <Text 
                style={{color: activity.status === "Upcoming"
                    ? "#F09E00": activity.status === "Completed"
                    ? "green" 
                    : "red"}} 
                className="font-bold text-lg py-1">
                    {activity.status}
                </Text>
                <Text>{formatDateTime(activity.dateTime)}</Text>
            </View>
            <View>
                <View 
                className='flex flex-row items-center pb-2'>
                    <MaterialIcons 
                    color={colors.primary} 
                    name="my-location" 
                    size={25} /> 
                    <Text 
                    className='px-2 text-base'>{activity.pickLocation}</Text>
                </View>
                <View 
                className='flex flex-row items-center '>
                    <MaterialIcons 
                    color={colors.primary} name="location-on" size={25}/>
                    <Text className='px-2 text-base'>{activity.dropLocation}</Text>
                </View>
            </View>
          <View 
          className='flex flex-row pt-3 pl-2'>
            <Text 
             className='pr-5 text-mediumGray text-sm'>{activity.riderName}</Text>
            <Text 
             className='pl-5 text-mediumGray text-sm'>{activity.vehicleName}</Text>
          </View>
        </View>
  )
}

export default ActivityContent