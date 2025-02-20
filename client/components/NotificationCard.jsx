import { View, Text, Image } from "react-native";
import { useSelector } from "react-redux";
const getStatusColor = (status) => {
  const statusColors = {
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };
  return statusColors[status.toLowerCase()] || "bg-gray-400";
};

const NotificationCard = ({ notification }) => {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };
  const { theme } = useSelector((state) => state.theme);
  const backgroundColor =
    theme === "dark" ? "rgba(217, 202, 246, 0.19)" : "rgba(141, 80, 255, 0.34)";
  const borderColor =
    theme === "dark" ? "rgba(163, 121, 249, 0.39)" : "rgba(141, 80, 255, 0.59)";
  return (
    <View
      className="flex-row items-center bg-primary p-3 my-2 rounded-xl shadow-md"
      style={{
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <Image
        source={{ uri: notification.productImage }}
        className="w-16 h-16 rounded-lg mr-4"
      />

      <View className="flex-1">
        <View className="flex-row space-x-2 items-center px-1">
          <Text
            className={`text-sm font-pmedium ${
              theme === "dark" ? "text-secondary-darkText" : "text-secondary"
            }`}
          >
            {notification.productName}
          </Text>
          <View
            className={`w-4 h-4 m-0 rounded-full ${
              statusColors[notification.status] || "bg-gray-500"
            }`}
          ></View>
        </View>

        <Text
          className={`text-sm text-gray-600 italic ${
            theme === "dark" ? "text-gray-200" : "text-black-200"
          }`}
        >
          {notification.leftDays > 0
            ? `⚠️ Your product ${notification.productName} expires in ${notification.leftDays} days!`
            : `❌ ${notification.productName} has expired on ${notification.expDate}! Please discard it.`}
        </Text>

        <Text
          className={`text-xs text-gray-500 mt-1 ${
            theme === "dark" ? "text-gray-100" : "text-black-200"
          }`}
        >
          🗓️ Expiry Date:{" "}
          <Text className="font-psemibold">
            {notification.expDate} ({notification.leftDays} days left)
          </Text>
        </Text>

        {/* Status Badge */}

        {/* Notification Date */}
        <Text
          className={`text-xs text-gray-700 mt-2 ${
            theme === "dark" ? "text-gray-200" : "text-black-200"
          }`}
        >
          📅 {new Date(notification.createdAt).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default NotificationCard;
