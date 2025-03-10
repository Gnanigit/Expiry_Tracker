import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import AvatarComponent from "../../components/AvatarComponent";
import { updateUserDetails } from "../../routes/auth_api";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import { setIsLogged, setUser } from "../../redux/slices/auth";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    avatar: user?.avatar || "",
    username: user?.username || "",
    email: user?.email || "",
    products: user?.numberOfProducts || 0,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    profilePicUpdated: false,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: user?.avatar || "",
      username: user?.username || "",
      email: user?.email || "",
      products: user?.numberOfProducts || 0,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      address: user?.address || "",
      pincode: user?.pincode || "",
    }));
  }, [user]);

  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        try {
          const resizedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }],
            { compress: 0.5 }
          );

          const base64Image = await FileSystem.readAsStringAsync(
            resizedImage.uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          setFormData((prevData) => ({
            ...prevData,
            profilePicUpdated: true,
            avatar: `data:image/jpeg;base64,${base64Image}`,
          }));
        } catch (error) {
          console.error("Error converting image to Base64:", error);
          Alert.alert("Error", "Failed to convert the image to Base64.");
        }
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "You need to grant access to your gallery."
      );
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const result = await updateUserDetails(formData);
      dispatch(setUser(result.user));
      dispatch(setIsLogged(true));
      setIsEditMode(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const background =
    theme === "dark" ? "rgba(145, 114, 205, 0.19)" : "rgba(103, 22, 254, 0.41)";
  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full`}
    >
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
      <Navbar toggleSidebar={toggleSidebar} />
      <ScrollView className="flex-1 px-4 mt-4 ">
        <View className="items-center justify-between">
          <View className="items-center justify-center">
            <View className="w-36 h-36 border border-territory rounded-full justify-center items-center relative">
              {user?.avatar ? (
                <AvatarComponent
                  className="w-[90%] h-[90%] rounded-lg"
                  avatar={formData?.avatar}
                  resizeMode="contain"
                />
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}

              {isEditMode && (
                <TouchableOpacity
                  onPress={handleEditAvatar}
                  className="absolute bottom-2 right-2 bg-secondary rounded-full p-2"
                >
                  <Image
                    source={icons.edit}
                    className="w-5 h-5"
                    style={{ tintColor: "white" }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="w-full flex-row gap-x-12 mt-1">
              <View className="flex-row justify-center items-center space-x-1">
                <Image
                  source={icons.username}
                  className="w-5 h-5"
                  tintColor="rgba(244, 159, 28, 1)"
                  resizeMode="contain"
                />
                <Text
                  className={`text-sm ${
                    theme === "dark"
                      ? "text-secondary-darkText"
                      : "text-secondary"
                  } font-pmedium `}
                >
                  {formData?.username}
                </Text>
              </View>
              <View className="flex-row justify-center items-center space-x-1">
                <Image source={icons.products} className="w-5 h-5" />
                <Text>
                  <Text
                    className={`text-md ${
                      theme === "dark"
                        ? "text-secondary-darkText"
                        : "text-secondary"
                    } font-pbold`}
                  >
                    {formData?.products}{" "}
                  </Text>

                  {formData?.products <= 1 ? (
                    <Text className="text-sm text-territory font-pmedium ">
                      Product
                    </Text>
                  ) : (
                    <Text className="text-sm text-territory font-pmedium ">
                      Products
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-[95%] flex-row justify-end mt-2">
            <TouchableOpacity onPress={toggleEditMode}>
              <Image
                source={icons.edit}
                className="w-5 h-5"
                style={{
                  tintColor: isEditMode
                    ? theme === "dark"
                      ? "rgb(171, 118, 246)"
                      : "rgba(94, 53, 177, 1)"
                    : "rgba(244, 159, 28, 1)",
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="mt-4 w-full">
            <FormField
              title="Email"
              placeholder="Email"
              value={formData.email}
              handleChangeText={(value) => handleInputChange("email", value)}
              otherStyles="mb-3"
              icon={icons.email_icon}
              textStyles={`${
                theme === "dark" ? "text-gray-100" : "text-black"
              } text-base font-pmedium`}
              titleStyle={`text-sm  ${
                theme === "dark" ? "text-gray-200" : "text-black-100"
              } font-psmedium`}
              inputViewStyle={`w-full  px-2 h-12 ${
                theme === "dark"
                  ? "border-secondary-darkBorder"
                  : "border-gray-300 "
              } rounded-xl focus:border-secondary`}
              editable={isEditMode}
            />

            <FormField
              title="First Name"
              placeholder="Add your First Name"
              value={formData.firstName}
              icon={icons.firstName}
              handleChangeText={(value) =>
                handleInputChange("firstName", value)
              }
              otherStyles="mb-3"
              textStyles={`${
                theme === "dark" ? "text-gray-100" : "text-black"
              } text-base font-pmedium`}
              titleStyle={`text-sm  ${
                theme === "dark" ? "text-gray-200" : "text-black-100"
              } font-psmedium`}
              inputViewStyle={`w-full  px-2 h-12 ${
                theme === "dark"
                  ? "border-secondary-darkBorder"
                  : "border-gray-300 "
              } rounded-xl focus:border-secondary`}
              editable={isEditMode}
            />
            <FormField
              title="Last Name"
              placeholder="Add your Last Name"
              value={formData.lastName}
              icon={icons.lastName}
              handleChangeText={(value) => handleInputChange("lastName", value)}
              otherStyles="mb-3"
              textStyles={`${
                theme === "dark" ? "text-gray-100" : "text-black"
              } text-base font-pmedium`}
              titleStyle={`text-sm  ${
                theme === "dark" ? "text-gray-200" : "text-black-100"
              } font-psmedium`}
              inputViewStyle={`w-full  px-2 h-12 ${
                theme === "dark"
                  ? "border-secondary-darkBorder"
                  : "border-gray-300 "
              } rounded-xl focus:border-secondary`}
              editable={isEditMode}
            />
            <FormField
              title="Address"
              placeholder="Add your Address"
              value={formData.address}
              icon={icons.location}
              handleChangeText={(value) => handleInputChange("address", value)}
              otherStyles="mb-3"
              textStyles={`${
                theme === "dark" ? "text-gray-100" : "text-black"
              } text-base font-pmedium`}
              titleStyle={`text-sm  ${
                theme === "dark" ? "text-gray-200" : "text-black-100"
              } font-psmedium`}
              inputViewStyle={`w-full  px-2 h-12 ${
                theme === "dark"
                  ? "border-secondary-darkBorder"
                  : "border-gray-300 "
              } rounded-xl focus:border-secondary`}
              editable={isEditMode}
            />
            <FormField
              title="Pincode"
              placeholder="Add your Pincode"
              value={formData.pincode}
              icon={icons.pincode}
              handleChangeText={(value) => handleInputChange("pincode", value)}
              otherStyles="mb-3"
              textStyles={`${
                theme === "dark" ? "text-gray-100" : "text-black"
              } text-base font-pmedium`}
              titleStyle={`text-sm  ${
                theme === "dark" ? "text-gray-200" : "text-black-100"
              } font-psmedium`}
              inputViewStyle={`w-full px-2 h-12 ${
                theme === "dark"
                  ? "border-secondary-darkBorder"
                  : "border-gray-300 "
              } rounded-xl focus:border-secondary`}
              editable={isEditMode}
              keyboardType="numeric"
            />
          </View>
          {isEditMode && (
            <CustomButton
              title="Update Profile"
              handlePress={handleUpdate}
              disabled={loading}
              containerStyles="w-[50%] rounded-lg min-h-[45px] mt-2 bg-territory-100 mb-2"
              fontStyles="font-pmedium"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
