import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Activity } from './Activity'
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
const UpcomingContent = () => {
    const StatusUpcoming: ActivityItem[] = Activity.filter((activity: ActivityItem) => activity.status === "Upcoming");

  return (
    <View className='mx-6 pb-10 h-full'> 
        <ScrollView
        style={{marginBottom:100}}  keyboardShouldPersistTaps="handled">
            {StatusUpcoming.map(activity => (
                <ActivityContent key={activity.id} activity={activity}/>
            ))}
        </ScrollView>
    </View>
  )
}

export default UpcomingContent