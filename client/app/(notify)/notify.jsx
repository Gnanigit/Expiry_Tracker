import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { Text, View, FlatList } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import NotificationCard from "../../components/NotificationCard";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Notify = () => {
  const { theme } = useSelector((state) => state.theme);
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  useEffect(() => {
    console.log("fetched notifications");
  }, [notifications]);

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        setPermissionsGranted(finalStatus === "granted");
      } else {
        console.log("Use a physical device");
      }
    };

    requestPermissions();
  }, []);

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } flex-1`}
    >
      <Navbar type={"notify"} />

      <View className="flex-1 px-2">
        {notifications?.length === 0 ? (
          <Text className="text-center text-gray-500 mt-5">
            No notifications yet!
          </Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <NotificationCard notification={item} />}
            className="mt-2"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notify;
