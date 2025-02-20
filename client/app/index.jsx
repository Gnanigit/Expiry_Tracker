import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Text, Image } from "react-native";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import images from "../constants/images";
import { useSelector } from "react-redux";
import { loginWithGoogle } from "../routes/auth_api";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/slices/products";
import { setIsLogged, setUser } from "../redux/slices/auth";

import "expo-dev-client";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const App = () => {
  const dispatch = useDispatch();
  GoogleSignin.configure({
    webClientId:
      "827269521347-b47m7ijdp3rtcuku3l7puvh6mf1nnpbj.apps.googleusercontent.com",
  });
  const { theme } = useSelector((state) => state.theme);
  const backgroundColor =
    theme === "dark" ? "rgba(42, 35, 58,1)" : "rgba(255, 255, 255, 1)";

  const style = theme === "dark" ? "light" : "dark";
  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data.idToken) {
        throw new Error("No ID Token received from Google Sign-In");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken
      );

      const userDetails = await auth().signInWithCredential(googleCredential);
      const {
        picture,
        email,
        family_name: lastName,
        given_name: firstName,
      } = userDetails.additionalUserInfo.profile;

      const password = userDetails.user.uid;
      const google = true;

      // Call backend Google login API
      const result = await loginWithGoogle(
        firstName,
        lastName,
        email,
        picture,
        password,
        google
      );

      dispatch(setUser(result.user));
      dispatch(setIsLogged(true));
      dispatch(setProducts(result.formattedProducts));

      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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
          />

          <CustomButton
            title="Continue with Email"
            type="email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full rounded-xl min-h-[55px] bg-secondary-200"
            fontStyles="font-pmedium"
          />
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[2px] bg-territory-100 mx-2" />
            <Text className="text-territory-100 font-pbold text-base">OR</Text>
            <View className="flex-1 h-[2px] bg-territory-100 mx-2" />
          </View>
          <CustomButton
            type="google"
            title="Continue with Google"
            fontStyles="font-pmedium"
            handlePress={() =>
              onGoogleButtonPress().then(() =>
                console.log("Continue with Google")
              )
            }
            containerStyles="w-full rounded-xl min-h-[55px] bg-secondary-200"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={backgroundColor} style={style} />
    </SafeAreaView>
  );
};

export default App;
