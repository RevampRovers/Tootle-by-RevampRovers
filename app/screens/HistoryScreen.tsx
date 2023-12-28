import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
} from "react-native";
import React, { useState } from "react";
import AppText from "../components/AppText";
import { toTitleCase } from "../utils/toTitleCase";
import Screen from "../components/Screen";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { ListItemSeparator } from "../components/lists";

enum ServiceType {
  UPCOMING = "Upcoming",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

const serviceColorMap = {
  [ServiceType.UPCOMING]: "#F09E00",
  [ServiceType.COMPLETED]: "green",
  [ServiceType.CANCELLED]: "red",
};

interface ActivityItem {
  id: number;
  status: string;
  dateTime: string;
  pickLocation: string;
  dropLocation: string;
  riderName: string;
  vehicleName: string;
}

export default function HistoryScreen() {
  const [serviceType, setServiceType] = useState<ServiceType>(
    ServiceType.UPCOMING
  );

  return (
    <Screen noKeyboardAwareScroll>
      <View className="my-3 mx-5 flex-row justify-center rounded-xl bg-gray-200 p-2">
        {Object.values(ServiceType).map((type) => (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ selected: serviceType === type }}
            key={type}
            onPress={() => {
              setServiceType(type);
            }}
            className={`${serviceType === type ? "bg-primary" : ""} 
            rounded-lg px-4 py-3 flex-1 items-center justify-center `}
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        keyboardShouldPersistTaps="handled"
        className="px-5"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="rounded-xl bg-white">
          {rides
            .filter((activity) => activity.status === serviceType)
            .map((activity, index) => (
              <ActivityContent
                key={activity.id}
                index={index}
                activity={activity}
              />
            ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function ActivityContent({
  activity,
  index,
}: {
  activity: ActivityItem;
  index: number;
}) {
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
    <>
      {index === 0 ? null : (
        <View className="pl-5">
          <ListItemSeparator />
        </View>
      )}
      <TouchableHighlight
        underlayColor={colors.highlight}
        className="py-1 pb-3 px-4"
      >
        <View>
          <View className="flex flex-row justify-between items-center">
            <Text
              style={{
                color: serviceColorMap[activity.status],
              }}
              className="font-bold text-lg py-1"
            >
              {activity.status}
            </Text>
            <Text>{formatDateTime(activity.dateTime)}</Text>
          </View>
          <View>
            <View className="flex flex-row items-center pb-2">
              <MaterialIcons
                color={colors.primary}
                name="my-location"
                size={25}
              />
              <Text className="px-2 text-base">{activity.pickLocation}</Text>
            </View>
            <View className="flex flex-row items-center ">
              <MaterialIcons
                color={colors.primary}
                name="location-on"
                size={25}
              />
              <Text className="px-2 text-base">{activity.dropLocation}</Text>
            </View>
          </View>
          <View className="flex flex-row pt-3 pl-2">
            <Text className="pr-5 text-mediumGray text-sm">
              {activity.riderName}
            </Text>
            <Text className="pl-5 text-mediumGray text-sm">
              {activity.vehicleName}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </>
  );
}

const rides = [
  {
    id: 1,
    status: ServiceType.COMPLETED,
    dateTime: "2023-01-01T08:30:00",
    pickLocation: "City Park",
    dropLocation: "Example City",
    riderName: "John Doe",
    vehicleName: "Pulsar 200",
  },
  {
    id: 2,
    status: ServiceType.UPCOMING,
    dateTime: "2023-01-05T14:45:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Lagankhel,Lalitpur",
    riderName: "Jane Doe",
    vehicleName: "Pulsar 200",
  },
  {
    id: 3,
    status: ServiceType.CANCELLED,
    dateTime: "2023-02-10T18:20:00",
    pickLocation: "Downtown",
    dropLocation: "Example City",
    riderName: "Bob Smith",
    vehicleName: "Motorcycle",
  },
  {
    id: 4,
    status: ServiceType.COMPLETED,
    dateTime: "2023-02-15T09:10:00",
    pickLocation: "Mountain Trail",
    dropLocation: "Example City",
    riderName: "Alice Johnson",
    vehicleName: "Electric Skateboard",
  },
  {
    id: 5,
    status: ServiceType.UPCOMING,
    dateTime: "2023-03-05T12:30:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Example City",
    riderName: "Charlie Brown",
    vehicleName: "Pulsar 200",
  },
  {
    id: 6,
    status: ServiceType.CANCELLED,
    dateTime: "2023-03-20T17:15:00",
    pickLocation: "Industrial Area",
    dropLocation: "Example City",
    riderName: "Eva Miller",
    vehicleName: "Skateboard",
  },
  {
    id: 7,
    status: ServiceType.COMPLETED,
    dateTime: "2023-04-02T11:45:00",
    pickLocation: "Rural Trail",
    dropLocation: "Example City",
    riderName: "David White",
    vehicleName: "Mountain Bike",
  },
  {
    id: 8,
    status: ServiceType.UPCOMING,
    dateTime: "2023-04-10T14:00:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Example City",
    riderName: "Sophia Davis",
    vehicleName: "Pulsar 200",
  },
  {
    id: 9,
    status: ServiceType.CANCELLED,
    dateTime: "2023-05-03T16:30:00",
    pickLocation: "Shopping District",
    dropLocation: "Example City",
    riderName: "Michael Wilson",
    vehicleName: "Segway",
  },
  {
    id: 10,
    status: ServiceType.COMPLETED,
    dateTime: "2023-05-15T07:20:00",
    pickLocation: "Lake Shore",
    dropLocation: "Example City",
    riderName: "Olivia Turner",
    vehicleName: "Rowboat",
  },
  {
    id: 11,
    status: ServiceType.UPCOMING,
    dateTime: "2023-01-05T14:45:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Lagankhel,Lalitpur",
    riderName: "Jane Doe",
    vehicleName: "Pulsar 200",
  },
  {
    id: 12,
    status: ServiceType.UPCOMING,
    dateTime: "2023-01-05T14:45:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Lagankhel,Lalitpur",
    riderName: "Jane Doe",
    vehicleName: "Pulsar 200",
  },
  {
    id: 13,
    status: ServiceType.UPCOMING,
    dateTime: "2023-01-05T14:45:00",
    pickLocation: "Nagarjun,Budhanilkantha",
    dropLocation: "Lagankhel,Lalitpur",
    riderName: "Jane Doe",
    vehicleName: "Pulsar 200",
  },
];
