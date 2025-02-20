import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setIsLogged, setUser } from "../../redux/slices/auth";
import { setProducts } from "../../redux/slices/products";
import { signIn } from "../../routes/auth_api";
import { useSelector } from "react-redux";
import { icons } from "../../constants";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const result = await signIn(form.email, form.password);

      await new Promise((resolve) => setTimeout(resolve, 0));
      dispatch(setUser(result.user));
      dispatch(setIsLogged(true));
      dispatch(setProducts(result.formattedProducts));

      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
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
          <View className="flex-row">
            <Text
              className={`text-shadow-md text-5xl font-extrabold ${
                theme === "dark"
                  ? "text-secondary-darkText"
                  : "text-secondary-100"
              }`}
            >
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
            className="w-[350px] h-[350px] mt-1"
            source={images.signUp}
          ></Image>
          <Text
            className={`text-shadow-md text-3xl font-pextrabold ${
              theme === "dark"
                ? "text-secondary-darkText"
                : "text-secondary-100"
            }`}
          >
            SIGN IN
          </Text>

          <FormField
            title="Email"
            placeholder="Enter Email..."
            value={form.email}
            icon={icons.email_icon}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4  px-2  space-y-0.5"
            titleStyle={`text-sm  ${
              theme === "dark" ? "text-gray-200" : "text-black-100"
            } font-psmedium`}
            textStyles={`${
              theme === "dark" ? "text-gray-100" : "text-black"
            } text-base font-pmedium`}
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
            icon={icons.password}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4 px-2  space-y-0.5"
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
            title="SIGN IN"
            handlePress={submit}
            containerStyles="w-[50%] rounded-[50px] min-h-[55px] mt-4 bg-secondary-200"
            fontStyles="font-pmedium"
          />
          <View className="justify-center gap-2 pt-4 flex-row">
            <Text className="text-lg text-gray-300 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-territory-100"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignIn;
