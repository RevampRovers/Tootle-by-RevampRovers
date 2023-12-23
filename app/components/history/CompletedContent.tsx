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

const CompletedContent = () => {
    const StatusCompleted: ActivityItem[] = Activity.filter((activity: ActivityItem) => activity.status === "Completed");
  return (
    <View className='mx-6 h-full'>
      {StatusCompleted.map(activity => (
        <ActivityContent key={activity.id} activity={activity}/>
      ))}
    </View>
  )
}

export default CompletedContent