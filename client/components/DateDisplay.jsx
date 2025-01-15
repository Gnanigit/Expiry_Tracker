import React from "react";
import { View, Text, TextInput } from "react-native";

const DateDisplay = ({ formattedDate }) => {
  return (
    <View className="w-full flex-row  items-center justify-center">
      {/* Day Block */}
      <View className="items-center">
        <Text className="text-xs mb-1 text-gray-500">Day</Text>
        <TextInput
          className="border border-secondary-100 rounded-md p-2 w-16 text-center"
          value={String(formattedDate.day)}
          editable={false}
        />
      </View>

      <Text className="text-xl font-bold mx-2 mt-4">-</Text>

      {/* Month Block */}
      <View className="items-center">
        <Text className="text-xs mb-1 text-gray-500">Month</Text>
        <TextInput
          className="border border-secondary-100 rounded-md p-2 w-16 text-center"
          value={String(formattedDate.month)}
          editable={false}
        />
      </View>

      <Text className="text-xl font-bold mx-2 mt-4">-</Text>

      {/* Year Block */}
      <View className="items-center">
        <Text className="text-xs mb-1 text-gray-500">Year</Text>
        <TextInput
          className="border border-secondary-100 rounded-md p-2 w-20 text-center"
          value={String(formattedDate.year)}
          editable={false}
        />
      </View>
    </View>
  );
};
export default DateDisplay;
