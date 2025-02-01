import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Text, Image, Link } from "react-native";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import images from "../constants/images";
import { useSelector } from "react-redux";

const App = () => {
  const { theme } = useSelector((state) => state.theme);
  const backgroundColor =
    theme === "dark" ? "rgba(42, 35, 58,1)" : "rgba(255, 255, 255, 1)";
  const style = theme == "dark" ? "light" : "dark";
  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full`}
    >
      <ScrollView>
        <View className="w-full h-full items-center justify-center px-4 my-2 min-h-[85vh]">
          <View className="flex-row">
            <Text className="text-shadow-md text-5xl font-extrabold text-secondary-100">
              Track{" "}
            </Text>
            <Text className="text-shadow-md text-5xl font-extrabold text-territory-100">
              Expiry
            </Text>
          </View>
          <Text
            className={`text-1xl font-regular ${
              theme === "dark" ? "text-gray-100" : "text-black"
            }`}
          >
            Track and Manage Expiry Dates Seamlessly
          </Text>
          <Image
            resizeMode="contain"
            className="w-[500px] h-[520px] my-5"
            source={images.start}
          ></Image>

          <CustomButton
            title="Continue with Email"
            type="email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full rounded-xl min-h-[55px] bg-secondary-200"
          />
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[2px] bg-territory-100 mx-2" />
            <Text className="text-territory-100 font-pbold text-base">OR</Text>
            <View className="flex-1 h-[2px] bg-territory-100 mx-2" />
          </View>
          <CustomButton
            type="google"
            title="Continue with Google"
            handlePress={() => router.push("/sign-up")}
            containerStyles="w-full rounded-xl min-h-[55px] bg-secondary-200"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={backgroundColor} style="light" />
    </SafeAreaView>
  );
};

export default App;
