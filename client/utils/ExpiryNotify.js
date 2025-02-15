import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Function to request notification permissions
export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.log("Must use a physical device for notifications");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

const getStatusCircle = (status) => {
  const statusMap = {
    red: "🔴",
    green: "🟢",
    yellow: "🟡",
  };

  return statusMap[status.toLowerCase()] || "⚪";
};
// Function to send expiry notification
export const sendExpiryNotification = async ({
  productName,
  leftDays,
  expDate,
  status,
}) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.log("Notifications not granted. Please enable them in settings.");
    return;
  }
  console.log(leftDays);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚠️ Expiry Alert!",
      body: `📦 ${productName} expires in ⏳ ${leftDays} days! 🗓️ Expiry Date: ${expDate} - ⚡ Status: ${getStatusCircle(
        status
      )}`,
      sound: "default",
    },

    trigger: { seconds: 1 },
  });
};
