import { View, Text } from 'react-native'
import React from 'react'
import { Activity } from './Activity';
import ActivityContent from './ActivityContent';


interface ActivityItem {
    id: number;
    status: string;
    dateTime: string;
    pickLocation: string;
    dropLocation: string;
    riderName: string;
    vehicleName: string;
  }

const CancelledContent = () => {
    const StatusCancelled: ActivityItem[] = Activity.filter((activity: ActivityItem) => activity.status === "Cancelled");
  return (
    <View className='mx-6 h-full'>
      {StatusCancelled.map(activity => (
        <ActivityContent key={activity.id} activity={activity}/>
      ))}
    </View>
  )
}

export default CancelledContent