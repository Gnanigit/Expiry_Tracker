import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Text } from "react-native";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
const App = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[92vh] px-4">
          <Text className="text-black-200">Welcome to Expiry tracker APP</Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-up")}
            containerStyles="w-full rounded-xl min-h-[62px]"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#FFFFFF" style="dark" />
    </SafeAreaView>
  );
};

export default App;
