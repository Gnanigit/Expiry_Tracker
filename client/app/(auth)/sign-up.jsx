import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import React, { useState } from "react";
import { signUp } from "../../routes/auth_api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { icons } from "../../constants";

const SignUp = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all fields");
    }
    setIsSubmitting(true);
    try {
      const result = await signUp(form.email, form.password, form.username);

      router.push("/sign-in");
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
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
          <Text className="text-5xl">
            <Text
              className={`text-shadow-md  text-5xl font-extrabold ${
                theme === "dark"
                  ? "text-secondary-darkText"
                  : "text-secondary-100"
              }`}
            >
              Track{" "}
            </Text>
            <Text className="text-shadow-md  text-5xl font-extrabold text-territory-100">
              Expiry
            </Text>
          </Text>
          <Text
            className={`text-1xl font-regular ${
              theme === "dark" ? "text-gray-100" : "text-black"
            }`}
          >
            Track and Manage Expiry Dates Seamlessly
          </Text>
          <Image
            resizeMode="contain"
            className="w-[280px] h-[280px] mt-1"
            source={images.signUp}
          ></Image>
          <Text
            className={`text-shadow-md text-3xl font-pextrabold ${
              theme === "dark"
                ? "text-secondary-darkText"
                : "text-secondary-100"
            }`}
          >
            SIGN UP
          </Text>
          <FormField
            title="Username"
            placeholder="Enter Username..."
            value={form.username}
            icon={icons.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-1.5 px-2  space-y-0.5"
            textStyles={`${
              theme === "dark" ? "text-gray-100" : "text-black"
            } text-base font-pmedium`}
            titleStyle={`text-sm  ${
              theme === "dark" ? "text-gray-200" : "text-black-100"
            } font-psmedium`}
            inputViewStyle={`w-full ${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } border-2 px-4 h-14 ${
              theme === "dark"
                ? "border-secondary-darkBorder"
                : "border-gray-300 "
            } rounded-2xl focus:border-secondary flex flex-row items-center`}
          />
          <FormField
            title="Email"
            placeholder="Enter Email..."
            icon={icons.email_icon}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-3  px-2  space-y-0.5"
            textStyles={`${
              theme === "dark" ? "text-gray-100" : "text-black"
            } text-base font-pmedium`}
            titleStyle={`text-sm  ${
              theme === "dark" ? "text-gray-200" : "text-black-100"
            } font-psmedium`}
            inputViewStyle={`w-full ${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } border-2 px-4 h-14 ${
              theme === "dark"
                ? "border-secondary-darkBorder"
                : "border-gray-300 "
            } rounded-2xl focus:border-secondary flex flex-row items-center`}
          />
          <FormField
            title="Password"
            placeholder="Enter Password..."
            value={form.password}
            icon={icons.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-3 px-2  space-y-0.5"
            textStyles={`${
              theme === "dark" ? "text-gray-100" : "text-black"
            } text-base font-pmedium`}
            titleStyle={`text-sm  ${
              theme === "dark" ? "text-gray-200" : "text-black-100"
            } font-psmedium`}
            inputViewStyle={`w-full ${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } border-2 px-4 h-14 ${
              theme === "dark"
                ? "border-secondary-darkBorder"
                : "border-gray-300 "
            } rounded-2xl focus:border-secondary flex flex-row items-center`}
          />
          <CustomButton
            title="SIGN UP"
            handlePress={submit}
            containerStyles="w-[42%] rounded-[50px] min-h-[55px] mt-4 bg-secondary-200"
            fontStyles="font-pmedium text-lg"
          />
          <View className="justify-center gap-2 pt-4 flex-row">
            <Text className="text-lg text-gray-300 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-territory"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignUp;
