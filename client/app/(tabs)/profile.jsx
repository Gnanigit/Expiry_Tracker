import React, { useState } from "react";
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
  const dispatch = useDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    avatar: user?.avatar || "",
    username: user?.username || "",
    email: user?.email || "",
    products: user?.products?.length || 0,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    profilePicUpdated: false,
  });

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

  return (
    <SafeAreaView className="bg-primary h-full">
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
                <Image source={icons.username} className="w-5 h-5" />
                <Text className="text-sm text-secondary font-pmedium text-center">
                  {formData?.username}
                </Text>
              </View>
              <View className="flex-row justify-center items-center space-x-1">
                <Image source={icons.products} className="w-5 h-5" />
                <Text className="text-sm text-territory font-pmedium text-center">
                  {formData?.products} products
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
                    ? "rgba(94, 53, 177, 1)"
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
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
              editable={isEditMode}
            />

            <FormField
              title="First Name"
              placeholder="Add your First Name"
              value={formData.firstName}
              handleChangeText={(value) =>
                handleInputChange("firstName", value)
              }
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
              editable={isEditMode}
            />
            <FormField
              title="Last Name"
              placeholder="Add your Last Name"
              value={formData.lastName}
              handleChangeText={(value) => handleInputChange("lastName", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
              editable={isEditMode}
            />
            <FormField
              title="Address"
              placeholder="Add your Address"
              value={formData.address}
              handleChangeText={(value) => handleInputChange("address", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
              editable={isEditMode}
            />
            <FormField
              title="Pincode"
              placeholder="Add your Pincode"
              value={formData.pincode}
              handleChangeText={(value) => handleInputChange("pincode", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
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
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
