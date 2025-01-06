import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center items-center min-h-[92vh] px-4">
        <Text className="text-black-200">This is SignIn</Text>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
