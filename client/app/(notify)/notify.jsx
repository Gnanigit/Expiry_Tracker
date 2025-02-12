import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Notify = () => {
  const { theme } = useSelector((state) => state.theme);
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

  const sendNotification = async () => {
    if (!permissionsGranted) {
      console.log("Notifications not granted. Please enable them in settings.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notification Alert",
        body: "You clicked the Notify button!",
        sound: "default",
      },
      trigger: { seconds: 1 },
    });
  };

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } flex-1`}
    >
      <Navbar type={"notify"} />
      <View className="flex-1 items-center px-3 py-3">
        <TouchableOpacity onPress={sendNotification} style={styles.button}>
          <Text style={styles.buttonText}>Notify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Notify;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
