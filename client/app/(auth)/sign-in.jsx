import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import React, { useState } from "react";
const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    // if (!form.email || !form.password) {
    //   Alert.alert("Error", "Please fill in all fields");
    // }
    try {
      // const result = await signIn(form.email, form.password);
      // dispatch(setUser(result.user));
      // dispatch(setIsLogged(true));
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full h-full items-center justify-center px-4 my-2 min-h-[85vh]">
          <Text className="text-5xl">
            <Text className="text-shadow-md text-5xl font-extrabold text-secondary-100">
              Track{" "}
            </Text>
            <Text className="text-shadow-md text-5xl font-extrabold text-territory-100">
              Expiry
            </Text>
          </Text>
          <Text className="text-1xl font-regular">
            Track and Manage Expiry Dates Seamlessly
          </Text>
          <Image
            resizeMode="contain"
            className="w-[350px] h-[350px] mt-1"
            source={images.signUp}
          ></Image>
          <Text className="text-shadow-md text-3xl font-extrabold text-secondary-100">
            SIGN IN
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4  px-2"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4 px-2"
          />
          <CustomButton
            title="SIGN IN"
            handlePress={submit}
            containerStyles="w-[50%] rounded-[50px] min-h-[55px] mt-4"
          />
          <View className="justify-center gap-2 pt-4 flex-row">
            <Text className="text-lg text-gray-300 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-territory-100"
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
